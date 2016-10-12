/**
 * Imports
 */
import React from 'react';

// Required components
import AuthenticatedComponent from '../../core/AuthenticatedComponent';

/**
 * Component
 */
class AccountBase extends React.Component {

    //*** Template ***//

    render() {
        return (
            <div className="account-base">
                {this.props.children}
            </div>
        );
    }
}

/**
 * This component requires Authentication
 */
const AccountWrapper = AuthenticatedComponent(AccountBase);

/**
 * Exports
 */
export default AccountWrapper;
