import { Modal, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';

interface ConfirmDeleteModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    titleText: string;
    messageText: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
                                                                   isVisible,
                                                                   onCancel,
                                                                   onConfirm,
                                                                   titleText,
                                                                   messageText,
                                                               }) => {
    return (
        <Modal
            title={titleText}
            open={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="confirm" type="primary" danger onClick={onConfirm}>
                    <DeleteOutlined /> Delete
                </Button>,
            ]}
        >
            <p>{messageText}</p>
        </Modal>
    );
};

export default ConfirmDeleteModal;
