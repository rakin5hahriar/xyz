import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="font-medium text-gray-600 text-sm mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </div>
  )
}

function DataList({ title, data, showPercentage = false, total = 0 }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 text-lg mb-4">{title}</h3>
      <div className="space-y-3 max-h-64 overflow-auto">
        {data.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No data available</div>
        ) : (
          data.map((item, index) => {
            const percentage = showPercentage && total > 0 ? Math.round((item.count / total) * 100) : 0
            return (
              <div key={index} className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-gray-700 truncate flex-1 mr-3">{item._id || 'Unknown'}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{item.count}</span>
                  {showPercentage && <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">({percentage}%)</span>}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function RecentClicks({ clicks }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 text-lg mb-4">Recent Clicks</h3>
      <div className="space-y-4 max-h-96 overflow-auto">
        {clicks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No recent clicks</div>
        ) : (
          clicks.map((click, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-gray-900 font-medium mb-2">
                    {click.country} • {click.device} • {click.browser}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    IP: {click.ip} • OS: {click.os}
                  </div>
                  {click.referer && (
                    <div className="text-sm text-gray-500 truncate">
                      From: {click.referer}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400 ml-4 text-right">
                  {new Date(click.at).toLocaleDateString()}
                  <br />
                  {new Date(click.at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function Analytics(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
  const token = localStorage.getItem('token')

  useEffect(()=>{
    const load = async () => {
      try {
        const res = await axios.get(api + '/api/urls/' + id + '/analytics', { headers: { Authorization: 'Bearer ' + token } })
        setData(res.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    </div>
  )
  
  if (!data) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600">Failed to load analytics</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Analytics for {data.url.shortCode}</h1>
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium transition-colors"
            >
              ← Back
            </button>
          </div>
          <p className="text-gray-600">
            Original: <a href={data.url.originalUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline break-all">
              {data.url.originalUrl}
            </a>
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Clicks" value={data.total} />
          <StatCard title="Unique Visitors" value={data.uniqueVisitors} />
          <StatCard title="Click Rate" value={data.uniqueVisitors ? `${Math.round((data.total / data.uniqueVisitors) * 100) / 100}` : '0'} subtitle="clicks per visitor" />
          <StatCard title="Countries" value={data.byCountry.length} subtitle="different countries" />
        </div>

        {/* Charts and Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DataList 
            title="Top Countries" 
            data={data.byCountry} 
            showPercentage={true} 
            total={data.total} 
          />
          <DataList 
            title="Devices" 
            data={data.byDevice} 
            showPercentage={true} 
            total={data.total} 
          />
          <DataList 
            title="Browsers" 
            data={data.byBrowser} 
            showPercentage={true} 
            total={data.total} 
          />
          <DataList 
            title="Operating Systems" 
            data={data.byOs} 
            showPercentage={true} 
            total={data.total} 
          />
        </div>

        {/* Referrer Sources */}
        <div className="mb-8">
          <DataList 
            title="Traffic Sources" 
            data={data.byReferrer.filter(r => r._id).map(r => ({
              ...r,
              _id: r._id.length > 50 ? r._id.substring(0, 50) + '...' : r._id
            }))} 
            showPercentage={true} 
            total={data.total} 
          />
        </div>

        {/* Time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-lg mb-6">Last 7 Days</h3>
            <div className="grid grid-cols-7 gap-3">
              {Array.from({length: 7}).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toISOString().split('T')[0];
                const dayData = data.last7Days.find(d => d._id === dateStr);
                const count = dayData?.count || 0;
                return (
                  <div key={i} className="text-center">
                    <div className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors">
                      <div className="text-xs text-gray-500 mb-1">{date.toLocaleDateString('en', {weekday: 'short'})}</div>
                      <div className="text-lg font-semibold text-gray-900">{count}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-lg mb-6">Last 24 Hours</h3>
            <div className="flex items-end justify-between gap-1 h-32">
              {Array.from({length: 24}).map((_, i) => {
                const hour = String(i).padStart(2, '0') + ':00';
                const hourData = data.last24Hours.find(h => h._id === hour);
                const count = hourData?.count || 0;
                const maxCount = Math.max(...data.last24Hours.map(h => h.count), 1);
                const height = Math.max((count / maxCount) * 100, 4);
                
                return (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-600 hover:bg-blue-700 w-full rounded-sm mb-2 transition-colors cursor-pointer" 
                      style={{ height: `${height}px` }}
                      title={`${hour}: ${count} clicks`}
                    ></div>
                    <div className="text-xs text-gray-500 transform -rotate-45 origin-center">
                      {i % 4 === 0 ? hour : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentClicks clicks={data.recentClicks} />
      </div>
    </div>
  )
}
