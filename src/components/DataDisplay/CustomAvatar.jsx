import React from 'react';
import { Avatar, AvatarProps, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { cn } from '../../utils/cn';



/**
 * CustomAvatar - Enhanced Avatar
 */
export const CustomAvatar = ({
  name,
  src,
  showTooltip = false,
  online,
  size = 'default',
  className,
  ...props
}) => {
  const getInitials = (name?) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatar = (
    <div className={cn('relative inline-block', className)}>
      <Avatar
        src={src}
        size={size}
        icon={!src && !name ? <UserOutlined /> }
        {...props}
      >
        {!src && name && getInitials(name)}
      </Avatar>
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
            online ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );

  if (showTooltip && name) {
    return <Tooltip title={name}>{avatar}</Tooltip>;
  }

  return avatar;
};

CustomAvatar.displayName = 'CustomAvatar';

// Avatar Group




export const CustomAvatarGroup = ({
  items,
  max = 4,
  size = 'default',
  className,
}) => {
  return (
    <Avatar.Group maxCount={max} size={size} className={className}>
      {items.map((item, index) => (
        <CustomAvatar
          key={index}
          name={item.name}
          src={item.src}
          style={{ backgroundColor.color }}
          showTooltip
        />
      ))}
    </Avatar.Group>
  );
};

CustomAvatarGroup.displayName = 'CustomAvatarGroup';

// User Avatar (with name display)


export const UserAvatar = ({
  name,
  src,
  subtitle,
  size = 'default',
  direction = 'horizontal',
  className,
}) => {
  const avatarSize = { small: 32, default: 40, large: 48 }[size];

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        direction === 'vertical' && 'flex-col text-center',
        className
      )}
    >
      <CustomAvatar name={name} src={src} size={avatarSize} />
      <div>
        <div className={cn('font-medium text-gray-800', size === 'small' && 'text-sm')}>
          {name}
        </div>
        {subtitle && (
          <div className={cn('text-gray-500', size === 'small' ? 'text-xs' : 'text-sm')}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

UserAvatar.displayName = 'UserAvatar';

