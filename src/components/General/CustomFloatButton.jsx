import React from 'react';
import { FloatButton, FloatButtonProps, FloatButtonGroupProps } from 'antd';
import {
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  CommentOutlined,
  UpOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { cn } from '../../utils/cn';

// Interface{
  /** Tooltip text */
  tooltipText?;
  /** Position */
  position?: 'right' | 'left';
}

/**
 * CustomFloatButton - Enhanced Float Button
 */
export const CustomFloatButton.FC<CustomFloatButtonProps> = ({
  tooltipText,
  position = 'right',
  className,
  style,
  ...props
}) => {
  const positionStyle = position === 'left' ? { left: 24, right: 'auto' } : {};

  return (
    <FloatButton
      tooltip={tooltipText}
      className={className}
      style={{ ...positionStyle, ...style }}
      {...props}
    />
  );
};

CustomFloatButton.displayName = 'CustomFloatButton';

// Float Button Group
// Interface{
  position?: 'right' | 'left';
}

export const CustomFloatButtonGroup.FC<CustomFloatButtonGroupProps> = ({
  position = 'right',
  style,
  children,
  ...props
}) => {
  const positionStyle = position === 'left' ? { left: 24, right: 'auto' } : {};

  return (
    <FloatButton.Group style={{ ...positionStyle, ...style }} {...props}>
      {children}
    </FloatButton.Group>
  );
};

CustomFloatButtonGroup.displayName = 'CustomFloatButtonGroup';

// Back to Top Button
// Interface{
  visibilityHeight?;
  duration?;
  position?: 'right' | 'left';
}

export const BackToTopButton.FC<BackToTopButtonProps> = ({
  visibilityHeight = 400,
  duration = 450,
  position = 'right',
}) => {
  const positionStyle = position === 'left' ? { left: 24, right: 'auto' } : {};

  return (
    <FloatButton.BackTop
      visibilityHeight={visibilityHeight}
      duration={duration}
      style={positionStyle}
      tooltip="กลับขึ้นด้านบน"
    />
  );
};

BackToTopButton.displayName = 'BackToTopButton';

// Help Float Button
// Interface{
  onHelp?: () => void;
  onChat?: () => void;
  onFeedback?: () => void;
  position?: 'right' | 'left';
}

export const HelpFloatButton.FC<HelpFloatButtonProps> = ({
  onHelp,
  onChat,
  onFeedback,
  position = 'right',
}) => {
  const positionStyle = position === 'left' ? { left: 24, right: 'auto' } : {};

  return (
    <FloatButton.Group
      trigger="hover"
      style={{ ...positionStyle }}
      icon={<QuestionCircleOutlined />}
    >
      {onHelp && (
        <FloatButton
          icon={<QuestionCircleOutlined />}
          tooltip="ช่วยเหลือ"
          onClick={onHelp}
        />
      )}
      {onChat && (
        <FloatButton
          icon={<CustomerServiceOutlined />}
          tooltip="แชทกับเรา"
          onClick={onChat}
        />
      )}
      {onFeedback && (
        <FloatButton
          icon={<CommentOutlined />}
          tooltip="ส่งความคิดเห็น"
          onClick={onFeedback}
        />
      )}
    </FloatButton.Group>
  );
};

HelpFloatButton.displayName = 'HelpFloatButton';

// Action Float Button (FAB)
// Interface{
  actions{
    key;
    icon.ReactNode;
    tooltip?;
    onClick?: () => void;
  }>;
  position?: 'right' | 'left';
}

export const ActionFloatButton.FC<ActionFloatButtonProps> = ({
  actions,
  position = 'right',
}) => {
  const positionStyle = position === 'left' ? { left: 24, right: 'auto' } : {};

  return (
    <FloatButton.Group
      trigger="click"
      style={{ ...positionStyle }}
      icon={<PlusOutlined />}
    >
      {actions.map((action) => (
        <FloatButton
          key={action.key}
          icon={action.icon}
          tooltip={action.tooltip}
          onClick={action.onClick}
        />
      ))}
    </FloatButton.Group>
  );
};

ActionFloatButton.displayName = 'ActionFloatButton';

