import { useState, useCallback } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config/constants'

export const useAdminData = (endpoint) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params })
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  const updateData = useCallback(async (id, data) => {
    setLoading(true)
    try {
      const response = await axios.put(`${API_BASE_URL}${endpoint}/${id}`, data)
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  return {
    data,
    loading,
    error,
    fetchData,
    updateData
  }
} 