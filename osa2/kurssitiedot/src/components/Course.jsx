const Header = ({ course }) => <h2>{course.name}</h2>;

const Part = ({ part }) => (
	<p key={part.id}>
		{part.name} {part.exercises}
	</p>
);

const Content = ({ course }) => (
	<div>
		{course.parts.map((p) => (
			<Part part={p} />
		))}
	</div>
);

const Total = ({ course }) => (
	<p>
		<b>
			Total number of exercises{' '}
			{course.parts.reduce((total, part) => total + part.exercises, 0)}
		</b>
	</p>
);

const Course = ({ course }) => (
	<div>
		<Header course={course} />
		<Content course={course} />
		<Total course={course} />
	</div>
);

export default Course;
