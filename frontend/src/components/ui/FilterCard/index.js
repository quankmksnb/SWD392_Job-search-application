import { useState } from 'react';

const FilterCard = ({
    title,
    items = [], // 👈 đảm bảo luôn có giá trị mặc định là mảng
    selectedItem,
    onItemSelect,
    keyProperty = null
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    // 👇 Nếu items không phải mảng, chuyển nó thành mảng rỗng
    const safeItems = Array.isArray(items) ? items : [];

    return (
        <div className="m-3 rounded-lg shadow-md">
            <div
                className="font-semibold rounded-lg p-2 bg-[#517FFF] text-white shadow-md cursor-pointer flex justify-between items-center"
                onClick={toggleOpen}
            >
                <span>{title}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <ul className="space-y-1">
                    {safeItems.map((item, index) => {
                        const key = keyProperty ? item[keyProperty] : item;
                        const displayValue = keyProperty ? item[keyProperty] : item;

                        return (
                            <li
                                key={item.id || index}
                                onClick={() => onItemSelect(item)}
                                className={`cursor-pointer m-3 p-2 rounded-lg transition-colors ${selectedItem === item
                                    ? 'text-[#517FFF] font-medium'
                                    : 'text-gray-700 hover:text-[#517FFF]'
                                    }`}
                            >
                                {displayValue}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FilterCard;
