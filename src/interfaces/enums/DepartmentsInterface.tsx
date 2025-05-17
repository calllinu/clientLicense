export enum Departments {
    Sales = 'Sales',
    Accounting = 'Accounting',
    HR = 'HR',
    Technical = 'Technical',
    Support = 'Support',
    Management = 'Management',
    IT = 'IT',
    ProductManagement = 'Product Management',
    Marketing = 'Marketing',
    ResearchAndDevelopment = 'R&D',
}

export const transformDepartmentValue = (department: Departments): string => {
    switch (department) {
        case Departments.Sales:
            return 'sales';
        case Departments.Accounting:
            return 'accounting';
        case Departments.HR:
            return 'hr';
        case Departments.Technical:
            return 'technical';
        case Departments.Support:
            return 'support';
        case Departments.Management:
            return 'management';
        case Departments.IT:
            return 'IT';
        case Departments.ProductManagement:
            return 'product_mng';
        case Departments.Marketing:
            return 'marketing';
        case Departments.ResearchAndDevelopment:
            return 'RandD';
        default:
            return '';
    }
};

export const departmentDisplayMap: Record<string, string> = {
    sales: 'Sales',
    accounting: 'Accounting',
    hr: 'HR',
    technical: 'Technical',
    support: 'Support',
    management: 'Management',
    IT: 'IT',
    product_mng: 'Product Management',
    marketing: 'Marketing',
    RandD: 'R&D',
};