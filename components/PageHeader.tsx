import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode; // For actions like buttons
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
    return (
        <div className="flex flex-row justify-between items-center sm:flex-row gap-4">
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    );
};
