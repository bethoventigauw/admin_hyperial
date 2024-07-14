import React, { useEffect, useState } from 'react';
import { getAllMaterials } from './inventoryAPI.js';
import './Inventory.css';
import { Table, Tooltip, Input } from 'antd';
import { WarningOutlined, SearchOutlined } from '@ant-design/icons';

const Inventory = () => {
    const [materials, setMaterials] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const materials = await getAllMaterials();
            setMaterials(materials);
        } catch (error) {
            console.error('Error fetching materials:', error);
            setMaterials([]);
        }
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredMaterials = materials.filter((material) =>
        material.MaterialName.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'WarehouseMaterialID',
            key: 'WarehouseMaterialID',
            align: 'left'
        },
        {
            title: 'Name',
            dataIndex: 'MaterialName',
            key: 'MaterialName',
            align: 'left'
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
            align: 'left'
        },
        {
            title: 'Unit',
            dataIndex: 'Unit',
            key: 'Unit',
            align: 'left'
        },
        {
            title: 'Quantity',
            dataIndex: 'Quantity',
            key: 'Quantity',
            align: 'left',
            render: (text, record) => (
                <span>
                    {record.Quantity}
                    {record.Quantity < 10 && record.Quantity > 0 && (
                        <Tooltip title="Low stock!">
                            <WarningOutlined className="low-stock-icon" />
                        </Tooltip>
                    )}
                    {record.Quantity === 0 && (
                        <Tooltip title="Out of stock!">
                            <WarningOutlined className="out-of-stock-icon" />
                        </Tooltip>
                    )}
                </span>
            )
        },
    ];

    return (
        <div className="inventory-container">
            <h1>Inventory</h1>
            <div className="materials-list">
                <h3>Materials List</h3>
                <div className="icon-legend">
                    <p><WarningOutlined className="low-stock-icon" /> Quantity under 10: Low stock</p>
                    <p><WarningOutlined className="out-of-stock-icon" /> Quantity 0: Out of stock</p>
                </div>
                <Input
                    placeholder="Search Materials"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={handleSearchChange}
                    style={{ marginBottom: 20 }}
                />
                <Table dataSource={filteredMaterials} columns={columns} pagination={false} />
            </div>
        </div>
    );
};

export default Inventory;
