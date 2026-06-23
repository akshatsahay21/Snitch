import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))


    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })


    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });


    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getAllProducts(req, res) {
    const { q, category, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    
    if (minPrice || maxPrice) {
        filter['price.amount'] = {};
        if (minPrice) filter['price.amount'].$gte = Number(minPrice);
        if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
    }

    let sortOptions = {};
    if (sort === 'price_asc') sortOptions = { 'price.amount': 1 };
    else if (sort === 'price_desc') sortOptions = { 'price.amount': -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const products = await productModel.find(filter).sort(sortOptions);

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getProductDetails(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    })
}


export async function addProductVariant(req, res) {

    const productId = req.params.productId;

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const files = req.files;
    const images = [];
    if (files || files.length !== 0) {
        (await Promise.all(files.map(async (file) => {
            const image = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
            return image
        }))).map(image => images.push(image))
    }

    const variantsData = req.body.variantsData ? JSON.parse(req.body.variantsData) : null;

    if (variantsData && Array.isArray(variantsData)) {
        variantsData.forEach(v => {
            product.variants.push({
                images,
                price: {
                    amount: Number(v.priceAmount) || product.price.amount,
                    currency: req.body.priceCurrency || product.price.currency
                },
                stock: Number(v.stock) || 0,
                attributes: v.attributes || {}
            });
        });
    } else {
        // Fallback for single variant addition
        const price = req.body.priceAmount;
        const stock = req.body.stock;
        const attributes = JSON.parse(req.body.attributes || "{}");

        product.variants.push({
            images,
            price: {
                amount: Number(price) || product.price.amount,
                currency: req.body.priceCurrency || product.price.currency
            },
            stock,
            attributes
        });
    }

    await product.save();

    return res.status(200).json({
        message: "Product variants added successfully",
        success: true,
        product
    });
}

export async function deleteProduct(req, res) {
    const { productId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    })

    if (!product) {
        return res.status(404).json({
            message: "Product not found or you don't have permission",
            success: false
        })
    }

    await productModel.findByIdAndDelete(productId)

    return res.status(200).json({
        message: "Product deleted successfully",
        success: true
    })
}

export async function updateProduct(req, res) {
    const { productId } = req.params
    const { title, description, priceAmount, priceCurrency, category } = req.body

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    })

    if (!product) {
        return res.status(404).json({
            message: "Product not found or you don't have permission",
            success: false
        })
    }

    if (title) product.title = title
    if (description) product.description = description
    if (priceAmount) product.price.amount = Number(priceAmount)
    if (priceCurrency) product.price.currency = priceCurrency
    if (category) product.category = category

    await product.save()

    return res.status(200).json({
        message: "Product updated successfully",
        success: true,
        product
    })
}