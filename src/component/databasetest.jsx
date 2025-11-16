import { useEffect, useState } from 'react'
import { supabase } from '../App';

function DatabaseTest() {
  const [status, setStatus] = useState('Testing connection...')
  const [testData, setTestData] = useState(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test 1: Check if we can connect
      const { data, error } = await supabase
        .from('todos')
        .select('count')
        .limit(1)
      
      if (error) {
        setStatus(`❌ Connection failed: ${error.message}`)
        return
      }

      setStatus('✅ Connected to database!')

      // Test 2: Try to insert data
      const testItem = {
        title: 'Test item - ' + new Date().toISOString(),
        completed: false
      }

      const { data: insertData, error: insertError } = await supabase
        .from('todos')
        .insert(testItem)
        .select()

      if (insertError) {
        setStatus(`✅ Connected, but insert failed: ${insertError.message}`)
        return
      }

      setStatus('✅ Connected and can write data!')

      // Test 3: Try to read it back
      const { data: readData, error: readError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (readError) {
        setStatus(`✅ Connected and writing works, but read failed: ${readError.message}`)
        return
      }

      setStatus('✅ FULL CONNECTION SUCCESS! Read & Write working!')
      setTestData(readData)

    } catch (err) {
      setStatus(`❌ Error: ${err.message}`)
    }
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px' }}>
      <h2>Database Connection Test</h2>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{status}</p>
      
      {testData && (
        <div>
          <h3>Latest items in database:</h3>
          <pre>{JSON.stringify(testData, null, 2)}</pre>
        </div>
      )}
      
      <button onClick={testConnection} style={{ marginTop: '10px', padding: '10px' }}>
        Test Again
      </button>
    </div>
  )
}

export default DatabaseTest