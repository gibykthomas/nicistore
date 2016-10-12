/**
 * Imports.
 */
/*global App, document, window */
import Debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router'
import ga from 'react-ga';
import { FluxibleComponent } from 'fluxible-addons-react';
var createBrowserHistory = require('history/lib/createBrowserHistory');
var createElement = require('fluxible-addons-react/createElementWithContext');
// Flux
import ApplicationStore from './stores/Application/ApplicationStore';
import CartStore from './stores/Cart/CartStore';

import clearRouteErrors from './actions/Application/clearRouteErrors';
import fetchAccountDetails from './actions/Account/fetchAccountDetails';
import fetchOrCreateCart from './actions/Cart/fetchOrCreateCart';
import navigateAction from './actions/Application/navigate';
import pageWidthChanged from './actions/Application/pageWidthChanged';
import triggerPageLoading from './actions/Application/triggerPageLoading';

// Utils
import fetchData from './utils/fetchData';
import fetchPageTitleAndSnippets from './utils/fetchPageTitleAndSnippets';
import { loadIntlPolyfill, loadLocaleData } from './utils/intlClientPolyfill';

import config from './config';

// Setup and initialize debugging utility.
const debug = Debug('nicistore');

// For chrome dev tool support.
window.React = React;

let dehydratedState = window.App;

// State sent from the server.


/**
 * Helper methods
 */

debug('rehydrating app');

function dispatchClearRouteErrors(context) {
    return new Promise(function(resolve, reject) {
        context.executeAction(clearRouteErrors, {}, function() { resolve(); });
    });
}

function dispatchFetchOrCreateCart(context) {
    return new Promise(function(resolve, reject) {
        context.executeAction(fetchOrCreateCart, {
            cartId: context.getStore(CartStore).getCartId(),
            cartAccessToken: context.getStore(CartStore).getCartAccessToken()
        }, function() { resolve(); });
    });
}

function dispatchGetAccountDetails(context) {
    return new Promise(function(resolve, reject) {
        context.executeAction(fetchAccountDetails, {}, function() { resolve(); });
    });
}

function dispatchPageResize(context) {
    return new Promise(function(resolve, reject) {
        contex == -t.executeAction(pageWidthChanged, window.innerWidth, function() { resolve(); });
    });
}

/**
 * Run application.
 * Everything that should be run after certain polyfills are initialized (e.g. Intl in Safari browser) should
 * be encapsulated in this method (e.g. fluxible app require, which needs Intl).

 */

var app = require('./app');

function runApp() {

    // Render application with re-hydrated state.

    var firstRender = true;

    function RenderApp(context) {

        console.log(context);

        async function fetchEverything(nextState, state) {

            console.log(state);

            console.log('I am fetching things');

            // Track Pageviews with Google Analytics

            console.log('hey how are you');

            if (config.googleAnalytics.enabled === true) {
                debug('Track pageview', state.pathname);
                ga.pageview(state.pathname);
            }

            // Send hit to Facebook Pixel
            try {
                fbq('track', 'PageView');
            } catch (err) {
                debug('Unable to send hit to Facebook Pixel', err);
            }

            if (firstRender) {
                debug('First render');

                // When first loading the app on the client, trigger fetching of user account
                // details before proceding so that, if a user is logged in, this information
                // is readily available to the application (e.g. for limiting access to certain pages)
                await dispatchGetAccountDetails(context);

                // Now that we have the account figured out, let's figure out the state of the cart,
                // fetching any one that we currently have or creating a new one if necessary
                await dispatchFetchOrCreateCart(context);

                // Don't call the action on the first render on top of the server rehydration
                // Otherwise there is a race condition where the action gets executed before
                // render has been called, which can cause the checksum to fail.
                firstRender = false; // This has to be done before render
                await RenderApp(context, Handler);

                // Add listener to page size changes and trigger respective action right away
                // so that components that depend on this information for implementing responsive
                // behaviors have this information available now and updated whenever it changes.
                // Note: this should only be triggered after React has finished rendering, to avoid
                // warnings regarding invalid DOM checksums.
                window.addEventListener('resize', dispatchPageResize.bind(null, context), false);
                dispatchPageResize(context);
            } else {
                debug('Single-page-mode render');

                context.executeAction(triggerPageLoading, true);

                // Trigger fetching and wait for the data required by the components of the given route.
                // On first render, this is done on the server side.
                await fetchData(context, state);

                // Set page title and snippets from the route handlers
                let pageTitleAndSnippets = fetchPageTitleAndSnippets(context, state);
                document.title = pageTitleAndSnippets ? pageTitleAndSnippets.title : config.app.title;
            }
        }

        let mountNode = document.getElementById('app');
        ReactDOM.render(
            React.createElement(
                FluxibleComponent, { context: context.getComponentContext() },
                React.createElement(Router, {
                    routes: context.getComponent(),
                    history: createBrowserHistory(),
                })
            ),
            mountNode
        );
    }

    // Initialize Google Analytics
    if (config.googleAnalytics.enabled === true) {
        debug('Initialize Google Analytics');
        ga.initialize(config.googleAnalytics.trackingId, config.googleAnalytics.options);
    }

    // Initialize Facebook Pixel
    if (config.facebookPixel.enabled === true) {
        try {
            fbq('init', config.facebookPixel.id);
            debug('Facebook pixel successfully initialized!');
        } catch (err) {
            console.error('Unable to initialize Facebook Pixel', err);
        }
    }

    // Re-hydrate application state.
    debug('rehydrating app');

    app.rehydrate(dehydratedState, function(err, context) {
        
        console.log(context, 'client context');

        if (err) {
            throw err;
        }

        window.debug = debug;

        window.context = context;
        RenderApp(context);

    });
}

/**
 * If browser does not support Intl, load the polyfill.
 * (Oh... and start the application afterwards!)
 */
const locale = document.documentElement.getAttribute('lang') || 'en'; // Default to EN
loadIntlPolyfill(locale)
    .then(loadLocaleData.bind(null, locale))
    .then(runApp)
    .catch((err) => {
        console.error('Error loading the Intl polyfill', err);
    });
