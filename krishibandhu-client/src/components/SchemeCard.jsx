const SchemeCard = ({ scheme }) => {
    return (
      <div className="bg-white p-4 shadow-md border rounded-md hover:shadow-lg transition">
        <h3 className="text-lg font-bold text-green-700">{scheme.title}</h3>
        <p className="text-sm text-gray-700 mt-1">{scheme.description}</p>
        <p className="text-xs text-gray-600 mt-2">
          <span className="font-semibold">Eligibility:</span> {scheme.eligibility}
        </p>
        <div className="flex justify-between items-center text-sm mt-3">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
            {scheme.category}
          </span>
          <span className="text-gray-500">{scheme.state}</span>
        </div>
      </div>
    );
  };
  
  export default SchemeCard;
  