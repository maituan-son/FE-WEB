import React, { useEffect, useState } from 'react'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../../api/product'
import FormProduct from '../../../components/FormProduct'
import { toast } from 'react-toastify'

const ListProducts = () => {
  const [products, setProducts] = useState([])
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterColor, setFilterColor] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts(``)
      console.log('Fetched products:', res.data.data.products)

      setProducts(res.data.data.products )
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, limit])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts(products.filter((product) => product.id !== id))
      toast.success('Xóa sản phẩm thành công')
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleEdit = (id) => {
    setEditId(id)
    setShowModal(true)
  }

  const handleAddOrUpdateProduct = async (product) => {
    try {
      if (editId) {
        const updated = await updateProduct(editId, product)
        setProducts(products.map((p) => (p.id === editId ? updated.data : p)))
        toast.success('Cập nhật sản phẩm thành công')
        setEditId(null)
      } else {
        const newProduct = {
          ...product,
          createdAt: new Date().toISOString(),
          completed: product.completed || false,
        }
        const created = await createProduct(newProduct)
        setProducts([...products, created.data])
        toast.success('Thêm sản phẩm thành công')
      }
      setShowModal(false)
    } catch (error) {
      console.error('Error adding/updating product:', error)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const handleFilterChange = (e) => {
    setFilterColor(e.target.value)
    setPage(1)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const filteredProducts = products
    .filter((product) =>
      product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      filterColor ? (product.colors ? product.colors.includes(filterColor) : false) : true
    )
    .sort((a, b) => {
      if (!sortField) return 0
      let aField = a[sortField]
      let bField = b[sortField]
      if (sortField === 'createdAt') {
        aField = new Date(aField)
        bField = new Date(bField)
      }
      if (aField < bField) return sortOrder === 'asc' ? -1 : 1
      if (aField > bField) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit
  )

  const totalPages = Math.ceil(filteredProducts.length / limit)

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <button
          onClick={() => {
            setEditId(null)
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Product
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <select
          value={filterColor}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Tất cả màu</option>
          <option value="red">Đỏ</option>
          <option value="blue">Xanh</option>
          <option value="green">Xanh lá</option>
          <option value="yellow">Vàng</option>
          <option value="black">Đen</option>
          <option value="white">Trắng</option>
          <option value="gray">Xám</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => handleSort('name')}
            className="bg-blue-200 px-2 rounded"
          >
            Sort Name {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </button>
          <button
            onClick={() => handleSort('price')}
            className="bg-gray-200 px-2 rounded"
          >
            Sort Price {sortField === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Sizes</th>
                <th>Colors</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedProducts.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-300">
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.price.toLocaleString('vi-VN')} {product.currency}</td>
                  <td>{product.sizes ? product.sizes.join(', ') : ''}</td>
                  <td>{product.colors ? product.colors.join(', ') : ''}</td>
                  <td>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-cover" />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td className="flex gap-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 border rounded">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <FormProduct
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddProduct={handleAddOrUpdateProduct}
          editId={editId}
          products={products}
        />
      )}
    </div>
  )
}

export default ListProducts



