import React, { useState } from 'react';

function AddInventory({ token }) {
    const [itemName, setItemName] = useState('');
    const [itemType, setItemType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [itemTypes] = useState(['raw_material', 'finished_product']); // Predefined item types

    const handleAddInventory = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3001/add-inventory', {
            method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
            body: JSON.stringify({
                item_name: itemName,
                item_type: itemType,
                quantity: quantity,
                supplier_id: supplierId,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Inventory item added successfully');
            setItemName('');
            setItemType('');
            setQuantity('');
            setSupplierId('');
        } else {
            alert(`Failed to add inventory item: ${data.error}`);
        }
    };

    return (
        <div className="addInventoryForm">
            <h2>Add Inventory Item</h2>
            <form onSubmit={handleAddInventory}>
                <div>
                    <label>Item Name:</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Item Type:</label>
                    <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        required
                    >
                        <option value="">Select Item Type</option>
                        {itemTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Supplier ID:</label>
                    <input
                        type="number"
                        value={supplierId}
                        onChange={(e) => setSupplierId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Inventory Item</button>
            </form>
        </div>
    );
}

export default AddInventory;