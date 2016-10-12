/**
 * Imports
 */
import React from 'react';
import {IndexRoute, NotFoundRoute, Route, Router} from 'react-router';

// Required components
import Application from './components/pages/Application/Application';
import NotFound from './components/pages/NotFound/NotFound';

import Homepage from './components/pages/Homepage/Homepage';
import Checkout from './components/pages/Checkout/Checkout';
import CollectionProductsPage from './components/pages/Collections/CollectionProductsPage';
import ProductListingPage from './components/pages/Products/ProductListingPage';
import ProductPage from './components/pages/Products/ProductPage';

import Account from './components/pages/Account/Account';
import AccountBase from './components/pages/Account/AccountBase';
import AccountOrderDetailsPage from './components/pages/Account/AccountOrderDetailsPage';
import Login from './components/pages/Account/Login';
import Logout from './components/pages/Account/Logout';
import Register from './components/pages/Account/Register';
import RegisterConfirm from './components/pages/Account/RegisterConfirm';
import Reset from './components/pages/Account/Reset';
import ResetConfirm from './components/pages/Account/ResetConfirm';

import StoresPage from './components/pages/StaticContent/StoresPage';
import InfoPage from './components/pages/StaticContent/InfoPage';

import ArticlesListingPage from './components/pages/Articles/ArticlesListingPage';
import ArticlePage from './components/pages/Articles/ArticlePage';

import Admin from './components/pages/Admin/Admin';
import AdminCollections from './components/pages/Admin/Collections/AdminCollections';
import AdminCollectionsEdit from './components/pages/Admin/Collections/AdminCollectionsEdit';
import AdminContents from './components/pages/Admin/Contents/AdminContents';
import AdminContentsEdit from './components/pages/Admin/Contents/AdminContentsEdit';
import AdminCustomers from './components/pages/Admin/Customers/AdminCustomers';
import AdminDashboard from './components/pages/Admin/Dashboard/AdminDashboard';
import AdminOrders from './components/pages/Admin/Orders/AdminOrders';
import AdminOrdersEdit from './components/pages/Admin/Orders/AdminOrdersEdit';
import AdminProducts from './components/pages/Admin/Products/AdminProducts';
import AdminProductsEdit from './components/pages/Admin/Products/AdminProductsEdit';

/**
 * Application's Routes
 */

function onEnter (nextState) {
    console.log(nextState, 'onEnter');
}

const routes = (
    <Route path="app" path="/:locale" component={Application} onEnter={onEnter}>
        <Route path="login" component={Login} />
        <Route path="logout" component={Logout} />
        <Route path="register" component={Register} />
        <Route path="register/confirm/:token" component={RegisterConfirm} />
        <Route path="reset" component={Reset} />
        <Route path="reset/confirm/:token" component={ResetConfirm} />
        <Route path="account" component={AccountBase}>
            <Route path="orders/:orderId/?" component={AccountOrderDetailsPage} />
            <IndexRoute component={Account} />
        </Route>
        <Route path="collections/:collectionId/?" component={CollectionProductsPage} />
        <Route path="collections/:collectionId/:collectionSlug/?" component={CollectionProductsPage} />
        <Route path="products/?" component={ProductListingPage} />
        <Route path="products/:productId/?" component={ProductPage} />
        <Route path="products/:productId/:productSlug/?" component={ProductPage} />
        <Route path="checkout" component={Checkout} />
        <Route path="stores" component={StoresPage} />
        <Route path="info" component={InfoPage} />
        <Route path="articles/?" component={ArticlesListingPage} />
        <Route path="articles/:contentId/?" component={ArticlePage} />
        <Route papath="articles/:contentId/:contentSlug/?" component={ArticlePage} />
        <Route path="adm" component={Admin}>
            <Route path="collections" component={AdminCollections} />
            <Route path="collections/:collectionId/?" component={AdminCollectionsEdit} />
            <Route path="contents" component={AdminContents} />
            <Route path="contents/:contentId/?" component={AdminContentsEdit} />
            <Route path="customers" component={AdminCustomers} />
            <Route path="orders" component={AdminOrders} />
            <Route path="orders/:orderId/?" component={AdminOrdersEdit} />
            <Route path="products" component={AdminProducts} />
            <Route path="products/:productId/?" component={AdminProductsEdit} />
            <IndexRoute component={AdminDashboard} />
        </Route>
        <IndexRoute component={Homepage} />
        <Route path="*" component={NotFound}/>
    </Route>
);

/**
 * Exports
 */
export default routes;
