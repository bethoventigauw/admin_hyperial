import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Tooltip, Popconfirm, Input } from 'antd';
import { Progress } from 'antd';
import { MoreOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './Project.css';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/allProjects');
      setProjects(response.data);
    } catch (error) {
      setError('Error fetching projects');
      console.error('Error fetching projects:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.nama_project.toLowerCase().includes(searchText.toLowerCase())
  );

  const approveProject = async (projectID) => {
    try {
      await axios.post(`http://localhost:5000/admin/approveProject/${projectID}`);
      message.success('Project approved successfully');
      fetchAllProjects();
    } catch (error) {
      setError('Error approving project');
      console.error('Error approving project:', error);
    }
  };

  const approveAdditionalMaterial = async (projectID) => {
    try {
      await axios.post(`http://localhost:5000/admin/approveAdditionalMaterial/${projectID}`);
      message.success('Additional materials approved successfully');
      fetchAllProjects();
    } catch (error) {
      setError('Error approving additional materials');
      console.error('Error approving additional materials:', error);
    }
  };

  const showDetails = (project) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const getProgressStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 10;
      case 'In Progress':
        return 50;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'In Progress':
        return 'darkblue';
      case 'Completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'nama_project',
      key: 'nama_project',
      render: (text) => <div className="project-name-column">{text}</div>,
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      key: 'projectManager',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div className="progress-container">
          <Progress
            percent={getProgressStatus(status)}
            strokeColor={getProgressColor(status)}
            showInfo={false}
          />
          <span className="progress-text">{status}</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<MoreOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
              onClick={() => showDetails(record)}
            />
          </Tooltip>
          {record.status === 'Pending' && (
            <Popconfirm
              title="Are you sure to approve this project?"
              onConfirm={() => approveProject(record.projectID)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Approve Project">
                <Button
                  type="link"
                  icon={<CheckCircleOutlined style={{ fontSize: '20px', color: 'green' }} />}
                />
              </Tooltip>
            </Popconfirm>
          )}
          {record.status === 'In Progress' &&
            record.MaterialProyeks.some(material => !material.approved) && (
              <Popconfirm
                title="Are you sure to approve additional materials?"
                onConfirm={() => approveAdditionalMaterial(record.projectID)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Approve Additional Materials">
                  <Button
                    type="link"
                    icon={<CheckCircleOutlined style={{ fontSize: '20px', color: 'orange' }} />}
                  />
                </Tooltip>
              </Popconfirm>
            )}
        </>
      ),
    },
    {
      title: 'New Update',
      key: 'newUpdate',
      render: (text, record) => {
        const pendingMaterials = record.MaterialProyeks.filter(material => !material.approved);
        return (
          <ul className="new-materials-list">
            {pendingMaterials.map(material => (
              <li key={material.materialProyekID} className="new-material-item">
                {material.materialName} - {material.quantity} (New Material)
              </li>
            ))}
          </ul>
        );
      },
    },
  ];

  return (
    <div className="all-project">
      <h1>All Projects</h1>
      <Input
        placeholder="Search Projects"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearchChange}
        style={{ marginBottom: 20 }}
      />
      <Table dataSource={filteredProjects} columns={columns} rowKey="projectID" />
      <Modal
        title="Project Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedProject && (
          <>
            <p><strong>Project Name:</strong> {selectedProject.nama_project}</p>
            <p><strong>Location:</strong> {selectedProject.location}</p>
            <p><strong>Start Date:</strong> {selectedProject.startDate}</p>
            <p><strong>End Date:</strong> {selectedProject.endDate}</p>
            <p><strong>Description:</strong> {selectedProject.description}</p>
            <p><strong>Progress:</strong></p>
            <Progress percent={getProgressStatus(selectedProject.status)} strokeColor={getProgressColor(selectedProject.status)} />
            <p><strong>Materials:</strong></p>
            <ul className="materials-list">
              {selectedProject.MaterialProyeks.filter(material => material.approved).map((material) => (
                <li key={material.materialProyekID} className="material-item">
                  {material.materialName} - {material.quantity}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Project;
