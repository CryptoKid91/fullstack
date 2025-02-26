import { useState, useEffect } from 'react';
import { Blog } from './components/Blog';
import { blogService } from './services/blogs';
import { Login } from './components/Login';
import * as loginService from './services/login';
import { Notification } from './components/Notification';
import { Bloglist } from './components/Bloglist';
import { NewBlog } from './components/NewBlog';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState({
		message: '',
		className: '',
	});

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	useEffect(() => {
		//Initially check local storage for faster response (and to comply with the assignment :))
		const storedUser = window.localStorage.getItem('user');
		if (storedUser) {
			setUser(storedUser);
		}

		// Verify login status from server
		(async () => {
			try {
				const user = await loginService.getLoginStatus();
				setUser(user);
			} catch {
				setUser(null);
			}
		})();
	}, []);

	const notify = (notification, type, timeout = 5000) => {
		setNotification({ message: notification, className: type });
		setTimeout(() => {
			setNotification({ message: '' });
		}, timeout);
	};

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({
				username,
				password,
			});
			window.localStorage.setItem('user', JSON.stringify(user));
			setUser(user);
			setUsername('');
			setPassword('');
		} catch {
			notify('wrong credentials', 'error');
		}
	};

	const handleLogout = async (event) => {
		event.preventDefault();
		await loginService.logout();
		window.localStorage.removeItem('user');
		setUser(null);
	};

	return (
		<div>
			<h1>Blogs</h1>
			<Notification notification={notification} />
			{!user && (
				<Login
					{...{
						handleLogin,
						username,
						setUsername,
						password,
						setPassword,
					}}
				/>
			)}
			{user && (
				<div>
					<Bloglist
						blogs={blogs}
						user={user.name}
						logout={handleLogout}
					/>
					<br />
					<NewBlog {...{ blogs, setBlogs, notify, setUser }} />
				</div>
			)}
		</div>
	);
};

export default App;
