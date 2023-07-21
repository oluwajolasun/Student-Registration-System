import { useEffect, useState } from "react"
import axios from "axios"
import Courses from "./Courses"

const CourseEnrolled = () => {

    const [courses, setCourses] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:3000/api/v1/courses/studentenrollments/1`)
            .then((res) => {
                // console.log(res.data)
                setCourses(res.data.courses)
                // console.log(courses.length)
            })
    }, [])

    return (
        <div>
            { courses && courses.length > 0 ? (
                courses.map((course) => (
                    <div key={ course.id }><Courses course={ { ...course, isEnrolled: true } } /></div>
                ))
            ) : (
                <div>
                    <p>Student is not enrolled in any course.</p>
                </div>
            ) }
        </div>
    );
}
export default CourseEnrolled 