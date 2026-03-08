import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import { errorHandler } from '../utils/error.js';
import { getMakingCharge, applyMakingChargeToProductDoc } from "../utils/pricing.js";
import mongoose from 'mongoose';

const router = express.Router();

export const getProducts = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const sort = req.query.sort;
        let sortOption = { createdAt: -1 }; // Default to newest

        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        } else if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        } else if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        }
        // console.log("started")
        const products = await Product.find()
            .sort(sortOption)
            .populate('categoryId', 'name')
            .skip(skip)
            .limit(pageSize);
        // console.log("ended")
        // const exec = await Product.find()
        //     .skip(skip)
        //     .limit(pageSize)
        //     .explain('executionStats');
        // console.log(exec)
        const makingCharge = await getMakingCharge();
        const response = products.map(p => applyMakingChargeToProductDoc(p, makingCharge));
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId).populate('categoryId', 'name');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // const category = product.categoryName;

        const makingCharge = await getMakingCharge();
        res.status(200).json(applyMakingChargeToProductDoc(product, makingCharge));
    } catch (err) {
        next(err);
    }
};


export const createProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, categoryId, stock, coverImageIndex } = req.body;
    const imageFiles = (req.files || []).map(file => file.filename).slice(0, 4);

    let coverIdx = 0;
    if (coverImageIndex !== undefined && imageFiles.length > 0) {
        const idx = Number(coverImageIndex);
        if (!Number.isNaN(idx) && idx >= 0 && idx < imageFiles.length) {
            coverIdx = idx;
        }
    }

    try {
        const normalizedName = String(name || '').trim();
        if (!normalizedName) {
            return res.status(400).json({ error: 'Product name is required' });
        }

        const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existingProduct = await Product.findOne({
            name: { $regex: `^${escapeRegex(normalizedName)}$`, $options: 'i' }
        }).exec();
        if (existingProduct) {
            return res.status(400).json({ error: 'Product with this name already exists' });
        }

        let category;
        const normalizedCat = String(categoryId || '').trim();
        if (mongoose.Types.ObjectId.isValid(normalizedCat)) {
            category = await Category.findById(normalizedCat);
        } else if (normalizedCat) {
            category = await Category.findOne({ name: { $regex: `^${normalizedCat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
            if (!category) {
                category = new Category({ name: normalizedCat });
                await category.save();
            }
        }

        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        const newProduct = new Product({
            name: normalizedName,
            description,
            price,
            stock,
            image: imageFiles,
            coverImageIndex: coverIdx,
            categoryId: category._id,
            categoryName: category.name
        });
        const savedProduct = await newProduct.save();

        category.products.push(savedProduct._id);
        await category.save();

        res.status(201).json(savedProduct);
    } catch (err) {
        next(err);
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, description, price, categoryId, stock, coverImageIndex } = req.body;

        const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (name !== undefined) {
            const normalizedName = String(name || '').trim();
            if (!normalizedName) {
                return res.status(400).json({ message: 'Name is required' });
            }
            const existingProduct = await Product.findOne({
                _id: { $ne: productId },
                name: { $regex: `^${escapeRegex(normalizedName)}$`, $options: 'i' }
            }).exec();
            if (existingProduct) {
                return res.status(400).json({ message: 'Product with this name already exists' });
            }
            product.name = normalizedName;
        }

        let newCategoryDoc;
        const normalizedCatInput = String(categoryId || '').trim();
        if (normalizedCatInput) {
            if (mongoose.Types.ObjectId.isValid(normalizedCatInput)) {
                newCategoryDoc = await Category.findById(normalizedCatInput);
            } else {
                newCategoryDoc = await Category.findOne({ name: { $regex: `^${normalizedCatInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
                if (!newCategoryDoc) {
                    newCategoryDoc = new Category({ name: normalizedCatInput });
                    await newCategoryDoc.save();
                }
            }
        }

        if (newCategoryDoc && String(newCategoryDoc._id) !== String(product.categoryId)) {
            const oldCategory = await Category.findById(product.categoryId);

            if (oldCategory) {
                oldCategory.products = oldCategory.products.filter(prodId => prodId.toString() !== productId);
                await oldCategory.save();
            }

            product.categoryId = newCategoryDoc._id;
            newCategoryDoc.products.push(productId);
            await newCategoryDoc.save();

            product.categoryName = newCategoryDoc.name;
        }

        if (description) product.description = description;
        if (price) product.price = price;
        if (stock !== undefined) product.stock = stock;

        if (req.files && req.files.length > 0) {
            const filenames = req.files.map(file => file.filename);
            product.image = [...product.image, ...filenames].slice(-4); // keep latest up to 4
        }

        if (coverImageIndex !== undefined) {
            const idx = Number(coverImageIndex);
            if (!Number.isNaN(idx) && idx >= 0 && idx < product.image.length) {
                product.coverImageIndex = idx;
            }
        }


        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
}


export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const categoryId = product.categoryId;

        // // Remove product ID from the associated category's products array
        // const category = await Category.findById(categoryId);
        // if (category) {
        //     category.products = category.products.filter(productId => productId.toString() !== req.params.productId);
        //     await category.save();
        // }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const category = await Category.findById(categoryId);
        if (category) {
            category.products = category.products.filter(productId => productId.toString() !== req.params.productId);
            await category.save();
        }

        await Product.deleteOne({ _id: req.params.productId });
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        next(err);
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const sort = req.query.sort;
        let sortOption = { createdAt: -1 }; // Default to newest

        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        } else if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        } else if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        }

        let query = {};
        if (categoryId && categoryId !== 'all') {
            let actualId = categoryId;
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                const cat = await Category.findOne({ name: { $regex: `^${categoryId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
                if (cat) {
                    actualId = cat._id;
                } else {
                    // If name not found and not a valid ID, return empty results instead of crashing
                    return res.status(404).json({ success: false, message: 'Category not found' });
                }
            }
            query = { categoryId: actualId };
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .populate('categoryId', 'name')
            .exec();
        const makingCharge = await getMakingCharge();
        const priced = products.map(p => applyMakingChargeToProductDoc(p, makingCharge));
        res.json({ success: true, products: priced });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const search = async (req, res) => {
    const query = req.params.q;
    try {
        if (!query || typeof query !== 'string') {
            throw new Error('Invalid search query');
        }

        const sort = req.query.sort;
        let sortOption = { createdAt: -1 }; // Default to newest

        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        } else if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        } else if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        }

        const results = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        })
            .sort(sortOption)
            .populate('categoryId'); // This will populate the category details in the results
        const makingCharge = await getMakingCharge();
        const priced = results.map((p) => applyMakingChargeToProductDoc(p, makingCharge));

        res.json(priced);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const similarProduct = async (req, res) => {
    try {
        const currentProduct = await Product.findById(req.params.productId);
        if (!currentProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const similarProducts = await Product.find({ categoryId: currentProduct.categoryId, _id: { $ne: currentProduct._id } })
            .populate('categoryId', 'name')
            .limit(7); // Limiting to 4 similar products
        const makingCharge = await getMakingCharge();
        const priced = similarProducts.map((p) => applyMakingChargeToProductDoc(p, makingCharge));

        res.json(priced);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const updateImages = async (req, res) => {
    const { productId } = req.params;
    const images = req.files || [];
    const filenames = images.map(item => item.filename).slice(0, 4);

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.image = filenames;
        if (product.coverImageIndex >= product.image.length) {
            product.coverImageIndex = 0;
        }

        const updatedImage = await product.save();
        res.json(updatedImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const validate = (method) => {
    switch (method) {
        case 'createProduct': {
            return [
                body('name', 'Name is required').trim().notEmpty(),
                body('description', 'Description is required').trim().notEmpty(),
                body('price', 'Price is required').isNumeric().notEmpty(),
                body('categoryId', 'Category is required').trim().notEmpty()
            ];
        }
        case 'updateProduct': {
            return [
                body('name', 'Name is required').optional().trim().notEmpty(),
                body('description', 'Description is required').optional().trim().notEmpty(),
                body('price', 'Price is required').optional().isNumeric().notEmpty(),
                body('categoryId', 'Category is required').optional().trim().notEmpty()
            ];
        }
    }
}