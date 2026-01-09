import React from 'react';

const sizeClassMap = {
    sm: 'title-icon--sm',
    md: 'title-icon--md',
    lg: 'title-icon--lg'
};

const iconSizeClassMap = {
    sm: 'title-icon-symbol--sm',
    md: 'title-icon-symbol',
    lg: 'title-icon-symbol--lg'
};

const TitleWithIcon = ({
    as: Tag = 'h2',
    size = 'md',
    iconClass = '',
    className = '',
    children,
    ...rest
}) => {
    const iconSymbolClass = iconSizeClassMap[size] || iconSizeClassMap.md;

    return (
        <Tag className={`title-with-icon ${className}`.trim()} {...rest}>
            {iconClass && (
                <i className={`title-icon-symbol ${iconSymbolClass} ${iconClass}`.trim()}></i>
            )}
            <span>{children}</span>
        </Tag>
    );
};

export default TitleWithIcon;
