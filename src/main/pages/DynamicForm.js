import React, { useState } from 'react';

const DynamicForm = () => {
  const [forms, setForms] = useState([]);

  const addForm = () => {
    setForms([...forms, { title: '', amount: '' }]);
  };

  const handleInputChange = (index, e) => {
    const updatedForms = [...forms];
    updatedForms[index][e.target.name] = e.target.value;
    setForms(updatedForms);
  };

  const handleSubmit = async () => {
    try {
      // Replace 'https://your-api-endpoint.com' with your actual API endpoint
      const apiUrl = 'https://your-api-endpoint.com';

      // Assuming you're sending the data as JSON
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forms),
      });

      // Handle the response, e.g., check for success or handle errors
      if (response.ok) {
        console.log('Data successfully sent to the API');
      } else {
        console.error('Failed to send data to the API');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={addForm}>+</button>
      {forms.map((form, index) => (
        <div key={index}>
          <form>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={(e) => handleInputChange(index, e)}
              />
            </label>
            <label>
              Amount:
              <input
                type="text"
                name="amount"
                value={form.amount}
                onChange={(e) => handleInputChange(index, e)}
              />
            </label>
          </form>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Data</button>
    </div>
  );
};

export default DynamicForm;
