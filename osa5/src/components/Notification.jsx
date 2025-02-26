import '../index.css';

export const Notification = ({ notification: { message, className } }) => {
	if (message === null) {
		return null;
	}

	return <div className={className}>{message}</div>;
};
