const ADMIN_API_URL = 'http://localhost:5000/admin';
const ORDERS_API_URL = 'http://localhost:5000/order';

export const getAllMaterials = async () => {
    const response = await fetch(`${ADMIN_API_URL}/allMaterials`);
    const data = await response.json();
    return data.materials || [];
};

export const getMaterialById = async (id) => {
    const response = await fetch(`${ADMIN_API_URL}/getMaterial/${id}`);
    return response.json();
};

export const addNewMaterial = async (material) => {
    const response = await fetch(`${ADMIN_API_URL}/newMaterial`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(material)
    });
    return response.json();
};

export const updateMaterial = async (id, material) => {
    const response = await fetch(`${ADMIN_API_URL}/editMaterial/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(material)
    });
    return response.json();
};

export const deleteMaterial = async (id) => {
    const response = await fetch(`${ADMIN_API_URL}/deleteMaterial/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};

export const updateInventory = async (orderId) => {
    const response = await fetch(`${ORDERS_API_URL}/updateInventory/${orderId}`, {
        method: 'POST'
    });
    return response.json();
};

// Fungsi baru untuk menambah pengeluaran material
export const addExpenditure = async (expenditure) => {
    const response = await fetch(`${ADMIN_API_URL}/addExpenditure`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenditure)
    });
    return response.json();
};

export const getExpenditures = async () => {
    const response = await fetch(`${ADMIN_API_URL}/expenditures`);
    const data = await response.json();
    console.log('Fetched Expenditures:', data); // Tambahkan logging di sini
    return data;
};