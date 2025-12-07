import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { useNotification, showNotification, showToast } from './CustomNotification';

const meta: Meta = {
  title: 'Feedback/CustomNotification',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

const NotificationDemo = () => {
  const { success, error, info, warning, toast } = useNotification();

  return (
    <Space direction="vertical" size="large">
      <div>
        <h4 className="mb-2 font-semibold">Notifications</h4>
        <Space wrap>
          <Button
            onClick={() =>
              success({
                message: 'สำเร็จ!',
                description: 'บันทึกข้อมูลเรียบร้อยแล้ว',
              })
            }
          >
            Success
          </Button>
          <Button
            danger
            onClick={() =>
              error({
                message: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
              })
            }
          >
            Error
          </Button>
          <Button
            onClick={() =>
              info({
                message: 'ข้อมูลเพิ่มเติม',
                description: 'ระบบจะทำการอัพเดทข้อมูลอัตโนมัติทุก 5 นาที',
              })
            }
          >
            Info
          </Button>
          <Button
            onClick={() =>
              warning({
                message: 'คำเตือน',
                description: 'พื้นที่เก็บข้อมูลใกล้เต็มแล้ว กรุณาลบไฟล์ที่ไม่ใช้',
              })
            }
          >
            Warning
          </Button>
        </Space>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Toast Messages</h4>
        <Space wrap>
          <Button onClick={() => toast.success('บันทึกสำเร็จ!')}>
            Toast Success
          </Button>
          <Button onClick={() => toast.error('เกิดข้อผิดพลาด!')}>
            Toast Error
          </Button>
          <Button onClick={() => toast.info('กำลังโหลดข้อมูล...')}>
            Toast Info
          </Button>
          <Button onClick={() => toast.warning('กรุณาตรวจสอบข้อมูล')}>
            Toast Warning
          </Button>
          <Button
            onClick={() => {
              const hide = toast.loading('กำลังประมวลผล...');
              setTimeout(() => {
                hide;
                toast.success('ประมวลผลเสร็จสิ้น!');
              }, 2000);
            }}
          >
            Toast Loading
          </Button>
        </Space>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Notification Placements</h4>
        <Space wrap>
          <Button
            onClick={() =>
              success({
                message: 'Top Left',
                description: 'แสดงที่มุมบนซ้าย',
                placement: 'topLeft',
              })
            }
          >
            Top Left
          </Button>
          <Button
            onClick={() =>
              success({
                message: 'Top Right',
                description: 'แสดงที่มุมบนขวา',
                placement: 'topRight',
              })
            }
          >
            Top Right
          </Button>
          <Button
            onClick={() =>
              success({
                message: 'Bottom Left',
                description: 'แสดงที่มุมล่างซ้าย',
                placement: 'bottomLeft',
              })
            }
          >
            Bottom Left
          </Button>
          <Button
            onClick={() =>
              success({
                message: 'Bottom Right',
                description: 'แสดงที่มุมล่างขวา',
                placement: 'bottomRight',
              })
            }
          >
            Bottom Right
          </Button>
        </Space>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Custom Duration</h4>
        <Space wrap>
          <Button
            onClick={() =>
              info({
                message: 'แสดง 10 วินาที',
                description: 'Notification นี้จะแสดง 10 วินาที',
                duration: 10,
              })
            }
          >
            10 seconds
          </Button>
          <Button
            onClick={() =>
              info({
                message: 'แสดงจนกว่าจะปิด',
                description: 'Notification นี้จะไม่ปิดอัตโนมัติ',
                duration: 0,
              })
            }
          >
            Never auto-close
          </Button>
        </Space>
      </div>
    </Space>
  );
};

export const Default: StoryObj = {
  render: () => <NotificationDemo />,
};

// Static Methods (outside React components)
export const StaticMethods: StoryObj = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h4 className="mb-2 font-semibold">Static Notifications (ใช้นอก React Component)</h4>
        <Space wrap>
          <Button
            onClick={() =>
              showNotification.success({
                message: 'Static Success',
                description: 'ใช้ได้นอก React Component',
              })
            }
          >
            Static Success
          </Button>
          <Button
            onClick={() =>
              showNotification.error({
                message: 'Static Error',
                description: 'ใช้ได้นอก React Component',
              })
            }
          >
            Static Error
          </Button>
        </Space>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Static Toast Messages</h4>
        <Space wrap>
          <Button onClick={() => showToast.success('Static Toast Success')}>
            Static Toast Success
          </Button>
          <Button onClick={() => showToast.error('Static Toast Error')}>
            Static Toast Error
          </Button>
        </Space>
      </div>
    </Space>
  ),
};

// Example Usage
export const ExampleUsage: StoryObj = {
  render: () => {
    const { success, error, toast } = useNotification();

    const handleSave = async () => {
      toast.loading('กำลังบันทึก...');
      
      try {
        // Simulate API call
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.3) {
              resolve(true);
            } else {
              reject(new Error('Random error'));
            }
          }, 1500);
        });

        success({
          message: 'บันทึกสำเร็จ!',
          description: 'ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว',
        });
      } catch (err) {
        error({
          message: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        });
      }
    };

    return (
      <div className="text-center">
        <p className="mb-4 text-gray-500">
          คลิกปุ่มด้านล่าง (มีโอกาส 30% ที่จะเกิด error)
        </p>
        <Button type="primary" onClick={handleSave}>
          บันทึกข้อมูล
        </Button>
      </div>
    );
  },
};

