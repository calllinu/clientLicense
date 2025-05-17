export const transformData = (salary: string): string => {
    if (!salary || typeof salary !== 'string') {
        return 'Unknown';
    }
    return salary.charAt(0).toUpperCase() + salary.slice(1).toLowerCase();
};

export const getDepartmentDisplayName = (department: string): string => {
    const normalizedDepartment = department.trim();
    const departmentDisplayMap: Record<string, string> = {
        'accounting': 'Accounting',
        'hr': 'HR',
        'technical': 'Technical',
        'support': 'Support',
        'management': 'Management',
        'IT': 'IT',
        'product_mng': 'Product Management',
        'marketing': 'Marketing',
        'RandD': 'R&D',
        'sales': 'Sales',
        'engineering': 'Engineering'
    };
    return departmentDisplayMap[normalizedDepartment] || normalizedDepartment;
};
