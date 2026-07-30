import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  // @ts-ignore dynamic lookup
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[name] || Icons.Tag;
  return <IconComponent className={className} />;
};
