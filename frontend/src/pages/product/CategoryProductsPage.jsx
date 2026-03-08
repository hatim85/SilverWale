import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductListCard from '../../components/ProductListCard';
import FilterSidebar from '../../components/FilterSidebar';

function CategoryProductsPage() {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [sort, setSort] = useState('newest');

    const slug = useMemo(() => {
        const raw = decodeURIComponent(String(categoryName || '')).trim().toLowerCase();
        return raw
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }, [categoryName]);

    const findCategory = (all) => {
        const match = (name) => {
            const s = String(name || '')
                .trim()
                .toLowerCase()
                .replace(/&/g, 'and')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            return s;
        };

        const altSlug = slug.endsWith('s') ? slug.slice(0, -1) : `${slug}s`;

        return (all || []).find((c) => {
            const nameSlug = match(c?.name);
            return (
                nameSlug === slug ||
                nameSlug === altSlug ||
                String(c?._id || '') === String(categoryName || '')
            );
        }) || null;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            setError('');
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/categories/getAllcategory`);
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : (data?.categories || []));
            } catch (e) {
                setError(e.message);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const selectedCategory = useMemo(() => findCategory(categories), [categories, slug]);

    useEffect(() => {
        const fetchProducts = async () => {
            // Use 'all' if no specific category is found/selected
            const catId = selectedCategory?._id || 'all';

            setProductsLoading(true);
            setError('');
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/products/getProductsByCategory/${catId}?sort=${sort}`);
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : (data?.products || []));
            } catch (e) {
                setError(e.message);
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory?._id, sort, slug]);

    const handleFilterChange = (filter) => {
        // Since we are on a category-specific page, changing the "Jewellery Type"
        // should effectively navigate the user to that category.
        const filterSlug = filter.name.toLowerCase().replace(/ /g, '-');
        navigate(`/category/${filterSlug}`);
    };

    const selectedFilters = selectedCategory ? [{ id: selectedCategory._id, name: selectedCategory.name }] : [];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="w-full md:w-64">
                        <FilterSidebar 
                            selectedFilters={selectedFilters}
                            onFilterChange={handleFilterChange}
                            onClearAll={() => navigate('/category/all')}
                        />
                    </div>

                    {/* Product Listing Section */}
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-serif tracking-widest text-black uppercase">
                                    {selectedCategory?.name || 'All Jewellery'}
                                </h1>
                                <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">
                                    {products.length} Products Found
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Sort By:</span>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="border-b border-gray-200 text-xs py-2 px-1 focus:outline-none focus:border-black bg-transparent uppercase tracking-widest font-medium"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {(categoriesLoading || productsLoading) && (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        )}
                        
                        {!!error && !categoriesLoading && !productsLoading && (
                            <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-sm">{error}</div>
                        )}

                        {!categoriesLoading && !productsLoading && !error && products.length === 0 && (
                            <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-sm">No products found</div>
                        )}

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
                            {products.map((product) => (
                                <ProductListCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
export default CategoryProductsPage;
