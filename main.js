async function process_argv() {
    let { argv } = process;
    argv = argv.slice(2);
    const result = await studentActivitiesRegistration(argv);

    return result;
}

async function getStudentActivities() {
    try {
        const response = await fetch('http://localhost:3001/activities');
        const data = await response.json();
        return data.map(activity => ({
            id: activity.id,
            name: activity.name,
            desc: activity.desc,
            days: activity.days
        }));
    } catch (error) {
        return error;
    }
}

async function studentActivitiesRegistration(data) {
    if (data[0] === "CREATE") {
        try {
            const activities = await getStudentActivities();
            const filteredActivities = activities.filter(value => value.days.includes(data[2]));

            const newData = {
                name: data[1],
                activities: filteredActivities.map(value => ({
                    name: value.name,
                    desc: value.desc,
                })),
            };

            const res = await fetch('http://localhost:3001/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData),
            });

            const datas = await res.json();

            return {
                id: datas.id,
                name: datas.name,
                activities: datas.activities.map(activity => ({ name: activity.name, desc: activity.desc }))
            }
        } catch (error) {
            return error;
        }
    } else if (data[0] === 'DELETE') {
        try {
            let response;

            await fetch(`http://localhost:3001/students/${data[1]}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            response = { message: `Successfully deleted student data with id ${data[1]}` };

            return response;
        } catch (error) {
            return error;
        }
    }
}

async function addStudent(name, day) {
    try {
        const activities = await getStudentActivities();
        const filteredActivities = activities.filter(activity => activity.days.includes(day));
        const student = {
            name,
            activities: filteredActivities.map(activity => ({ name: activity.name, desc: activity.desc }))
        };
        const response = await fetch('http://localhost:3001/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });
        const data = await response.json();
        return {
            id: data.id,
            name: data.name,
            activities: data.activities.map(activity => ({ name: activity.name, desc: activity.desc }))
        };
    } catch (error) {
        return error;
    }
}

async function deleteStudent(id) {
    try {
        await fetch(`http://localhost:3001/students/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return { message: `Successfully deleted student data with id ${id}` };
    } catch (error) {
        return error;
    }
}

process_argv()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = {
    studentActivitiesRegistration,
    getStudentActivities,
    addStudent,
    deleteStudent
};
