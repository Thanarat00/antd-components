import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CustomModal, ConfirmModal, DeleteConfirmModal, ResultModal } from './CustomModal';
import { Button, Form, Input } from 'antd';

const meta= {
  title: 'Feedback/CustomModal',
  component: {
    layout: 'centered' },
  tags: ,
};

export default meta;

const ModalDemo = ({ children, ...props }.ComponentProps<typeof CustomModal>> & { children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        เปิด Modal
      </Button>
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        {...props}
      >
        {children || <p>เนื้อหาภายใน Modal</p>}
      </CustomModal>
    </>
  );
};

export const Default= {
  render: () => (
    <ModalDemo title="Modal ตัวอย่าง">
      <p>นี่คือเนื้อหาภายใน Modal</p>
      <p>สามารถใส่เนื้อหาอะไรก็ได้</p>
    </ModalDemo>
  ) };

export const WithConfirm= {
  render: () => (
    <ModalDemo
      title="ยืนยันการบันทึก"
      onConfirm={async () => {
        await new Promise((r) => setTimeout(r, 1000));
        console.log('Confirmed!');
      }}
    >
      <p>คุณต้องการบันทึกข้อมูลนี้หรือไม่?</p>
    </ModalDemo>
  ),
};

export const DangerConfirm= {
  render: () => (
    <ModalDemo
      title="ยืนยันการลบ"
      onConfirm={() => console.log('Deleted!')}
      confirmDanger
      confirmText="ลบ"
    >
      <p className="text-red-500">การกระทำนี้ไม่สามารถย้อนกลับได้!</p>
    </ModalDemo>
  ),
};

export const FormModal= {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async () => {
      try {
        setLoading(true);
        const values = await form.validateFields();
        console.log('Form values:', values);
        await new Promise((r) => setTimeout(r, 1000));
        setOpen(false);
        form.resetFields();
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          เพิ่มรายการใหม่
        </Button>
        <CustomModal
          title="เพิ่มรายการใหม่"
          open={open}
          onClose={() => {
            setOpen(false);
            form.resetFields();
          }}
          onConfirm={handleSubmit}
          confirmText="บันทึก"
          confirmLoading={loading}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="ชื่อ"
              rules={[{ required: 'กรุณากรอกชื่อ' }]}
            >
              <Input placeholder="กรอกชื่อ" />
            </Form.Item>
            <Form.Item
              name="email"
              label="อีเมล"
              rules={[
                { required: 'กรุณากรอกอีเมล' },
                { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' },
              ]}
            >
              <Input placeholder="กรอกอีเมล" />
            </Form.Item>
          </Form>
        </CustomModal>
      </>
    );
  },
};

export const Sizes= {
  render: () => (
    <div className="flex gap-2">
      <ModalDemo title="Small Modal" size="small">
        <p>ขนาด Small (400px)</p>
      </ModalDemo>
      <ModalDemo title="Medium Modal" size="medium">
        <p>ขนาด Medium (520px)</p>
      </ModalDemo>
      <ModalDemo title="Large Modal" size="large">
        <p>ขนาด Large (720px)</p>
      </ModalDemo>
    </div>
  ) };

export const HideCancel= {
  render: () => (
    <ModalDemo
      title="ข้อมูลสำคัญ"
      hideCancel
      confirmText="รับทราบ"
      onConfirm={() => {}}
    >
      <p>นี่คือข้อความสำคัญที่ต้องอ่าน</p>
    </ModalDemo>
  ),
};

export const NoFooter= {
  render: () => (
    <ModalDemo title="Modal ไม่มี Footer" showFooter={false}>
      <p>Modal นี้ไม่มีปุ่มใดๆ</p>
      <p>ปิดได้โดยคลิกที่ X หรือนอก Modal</p>
    </ModalDemo>
  ),
};

// Confirm Modal Stories
export const ConfirmInfo= {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Info Confirm</Button>
        <ConfirmModal
          type="info"
          title="ข้อมูลเพิ่มเติม"
          content="นี่คือข้อมูลเพิ่มเติมสำหรับคุณ"
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const ConfirmSuccess= {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Success Confirm</Button>
        <ConfirmModal
          type="success"
          title="ดำเนินการสำเร็จ!"
          content="ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว"
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          confirmText="ตกลง"
        />
      </>
    );
  },
};

export const ConfirmWarning= {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Warning Confirm</Button>
        <ConfirmModal
          type="warning"
          title="คำเตือน!"
          content="การกระทำนี้อาจส่งผลกระทบต่อข้อมูลอื่น"
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const ConfirmError= {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button danger onClick={() => setOpen(true)}>Error Confirm</Button>
        <ConfirmModal
          type="error"
          title="ยืนยันการลบ"
          content="คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?"
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          confirmText="ลบ"
        />
      </>
    );
  },
};

// Delete Confirm Modal
export const DeleteConfirm= {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1500));
      setLoading(false);
      setOpen(false);
    };

    return (
      <>
        <Button danger onClick={() => setOpen(true)}>
          ลบสินค้า
        </Button>
        <DeleteConfirmModal
          itemName="iPhone 15 Pro"
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleDelete}
          confirmLoading={loading}
        />
      </>
    );
  },
};

// Result Modal
export const ResultSuccess= {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          แสดงผลสำเร็จ
        </Button>
        <ResultModal
          type="success"
          title="การสั่งซื้อสำเร็จ!"
          subtitle="เลขที่คำสั่งซื้อ-2024001234"
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const ResultError= {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button danger onClick={() => setOpen(true)}>
          แสดงข้อผิดพลาด
        </Button>
        <ResultModal
          type="error"
          title="เกิดข้อผิดพลาด"
          subtitle="กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ"
          open={open}
          onClose={() => setOpen(false)}
          extra={
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setOpen(false)}>ปิด</Button>
              <Button type="primary" onClick={() => setOpen(false)}>
                ลองอีกครั้ง
              </Button>
            </div>
          }
        />
      </>
    );
  },
};

