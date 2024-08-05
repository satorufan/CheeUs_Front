import { Layout } from 'react-admin';
import { AdminMenu } from './AdminMenu';

export const AdminMenuLayout = ({ children }) => (
    <Layout menu={AdminMenu}>
        {children}
    </Layout>
);