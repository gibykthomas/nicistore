import React from 'react';
import {FormattedMessage} from 'react-intl';

export default class FormattedMessageWrapper extends React.Component {
	render() {
		return(
			<FormattedMessage
	            id={this.props.message}
	            values={{
	                locales: this.props.locales
	            }}
	            defaultMessage={this.props.message} />
		);
	}
}