import { useState, useEffect, useRef } from 'react';
import { blogService } from './services/blogs';
import { Login } from './components/Login';
import { loginService } from './services/login';
import { Notification } from './components/Notification';
import { Bloglist } from './components/Bloglist';
import { NewBlog } from './components/NewBlog';
import { Togglable } from './components/Togglable';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState({
		message: '',
		className: '',
	});
	const blogFormRef = useRef();

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

	const createBlog = async (newBlog) => {
		try {
			const response = await blogService.create(newBlog);
			setBlogs(blogs.concat(response));
			notify(
				`A new blog with title ${response.title} by ${response.author} added`,
				'notice'
			);
			blogFormRef.current.toggleVisibility();
			return true;
		} catch (error) {
			if (error.name === 'AxiosError' && error.status === 401) {
				notify('Error, user not logged in', 'error');
				window.localStorage.removeItem('user');
				setUser(null);
			} else {
				console.log(error);
				notify(
					`Error adding new blog: ${error.response.data.error}`,
					'error'
				);
			}
			return false;
		}
	};

	const addLike = (blog) => async () => {
		const updatedBlog = await blogService.update(blog.id, {
			likes: (blog.likes || 0) + 1,
		});
		setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
	};

	const deleteBlog = (blog) => async () => {
		if (window.confirm(`Delete blog '${blog.title}'?`)) {
			try {
				await blogService.remove(blog.id);
				notify(`Succesfully deleted blog '${blog.title}'`, 'notice');
				setBlogs(blogs.filter((b) => b.id !== blog.id));
			} catch (error) {
				if (error.name === 'AxiosError' && error.status === 401) {
					notify('Error, user not logged in', 'error');
					window.localStorage.removeItem('user');
					setUser(null);
				} else if (
					error.name === 'AxiosError' &&
					error.status === 404
				) {
					notify('Blog already deleted', 'notice');
					setBlogs(blogs.filter((b) => b.id !== blog.id));
				} else {
					console.log(error);
					notify(`Error adding new blog: ${error.message}`, 'error');
				}
			}
		}
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
						user={user}
						logout={handleLogout}
						addLike={addLike}
						deleteBlog={deleteBlog}
					/>
					<br />
					<Togglable buttonLabel="New blog" ref={blogFormRef}>
						<NewBlog createBlog={createBlog} />
					</Togglable>
				</div>
			)}
		</div>
	);
};

export default App;
