import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function StatCard({ title, value, subtitle }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-medium text-gray-700">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
    </div>
  )
}

function DataList({ title, data, showPercentage = false, total = 0 }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-medium text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2 max-h-48 overflow-auto">
        {data.length === 0 ? (
          <div className="text-sm text-gray-500">No data available</div>
        ) : (
          data.map((item, index) => {
            const percentage = showPercentage && total > 0 ? Math.round((item.count / total) * 100) : 0
            return (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="text-sm truncate flex-1 mr-2">{item._id || 'Unknown'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.count}</span>
                  {showPercentage && <span className="text-xs text-gray-500">({percentage}%)</span>}
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
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-medium text-gray-700 mb-3">Recent Clicks</h3>
      <div className="space-y-2 max-h-64 overflow-auto">
        {clicks.length === 0 ? (
          <div className="text-sm text-gray-500">No recent clicks</div>
        ) : (
          clicks.map((click, index) => (
            <div key={index} className="text-xs border-b pb-2 last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-gray-900 font-medium">
                    {click.country} • {click.device} • {click.browser}
                  </div>
                  <div className="text-gray-500 mt-1">
                    IP: {click.ip} • OS: {click.os}
                  </div>
                  {click.referer && (
                    <div className="text-gray-500 mt-1 truncate">
                      From: {click.referer}
                    </div>
                  )}
                </div>
                <div className="text-gray-400 ml-2">
                  {new Date(click.at).toLocaleString()}
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

  if (loading) return <div className="text-center text-gray-600 mt-8">Loading analytics...</div>
  if (!data) return <div className="text-center text-red-600 mt-8">Failed to load analytics</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Analytics for {data.url.shortCode}</h1>
        <p className="text-gray-600 mt-1">
          Original: <a href={data.url.originalUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
            {data.url.originalUrl}
          </a>
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Clicks" value={data.total} />
        <StatCard title="Unique Visitors" value={data.uniqueVisitors} />
        <StatCard title="Click Rate" value={data.uniqueVisitors ? `${Math.round((data.total / data.uniqueVisitors) * 100) / 100}` : '0'} subtitle="clicks per visitor" />
        <StatCard title="Countries" value={data.byCountry.length} subtitle="different countries" />
      </div>

      {/* Charts and Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <DataList 
        title="Traffic Sources" 
        data={data.byReferrer.filter(r => r._id).map(r => ({
          ...r,
          _id: r._id.length > 50 ? r._id.substring(0, 50) + '...' : r._id
        }))} 
        showPercentage={true} 
        total={data.total} 
      />

      {/* Time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="font-medium text-gray-700 mb-3">Last 7 Days</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {Array.from({length: 7}).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split('T')[0];
              const dayData = data.last7Days.find(d => d._id === dateStr);
              return (
                <div key={i} className="p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">{date.toLocaleDateString('en', {weekday: 'short'})}</div>
                  <div className="font-medium">{dayData?.count || 0}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="font-medium text-gray-700 mb-3">Last 24 Hours</h3>
          <div className="grid grid-cols-6 gap-1 text-center text-xs">
            {Array.from({length: 24}).map((_, i) => {
              const hour = String(i).padStart(2, '0') + ':00';
              const hourData = data.last24Hours.find(h => h._id === hour);
              const count = hourData?.count || 0;
              const maxCount = Math.max(...data.last24Hours.map(h => h.count), 1);
              const height = Math.max((count / maxCount) * 40, 2);
              
              return (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="bg-indigo-600 w-full rounded-sm mb-1" 
                    style={{ height: `${height}px` }}
                    title={`${hour}: ${count} clicks`}
                  ></div>
                  <div className="text-gray-500">{i % 4 === 0 ? hour : ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentClicks clicks={data.recentClicks} />
    </div>
  )
}
