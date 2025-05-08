const HistoryOrderRequest = () => {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-bold">Order History</h2>
        <table className="w-full border border-collapse border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-gray-600">ID</th>
              <th className="p-2 border border-gray-600">Product Name</th>
              <th className="p-2 border border-gray-600">Date</th>
              <th className="p-2 border border-gray-600">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-900">
              <td className="p-2 border border-gray-600">001</td>
              <td className="p-2 border border-gray-600">Laptop</td>
              <td className="p-2 border border-gray-600">2025-03-07</td>
              <td className="p-2 border border-gray-600">14:30</td>
            </tr>
          </tbody>
        </table>
        <button className="px-4 py-2 mt-4 rounded bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-blue-500">Download CSV</button>
      </div>
    );
  };
  
  export default HistoryOrderRequest;
  