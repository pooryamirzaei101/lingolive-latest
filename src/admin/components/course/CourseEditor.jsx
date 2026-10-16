import { useState } from "react";

import ThumbnailUploader from "./ThumbnailUploader";
import CourseMediaManager from "./CourseMediaManager";
import SectionManager from "./SectionManager";
import CategoryManager from "./CategoryManager";
import PublishSettings from "./PublishSettings";


export default function CourseEditor() {


  const [course, setCourse] = useState({

    title: "",
    slug: "",

    category: "",
    level: "",

    teacher: "",

    shortDescription: "",
    longDescription: "",

    thumbnail: "",

    video: "",
    audio: "",
    pdf: "",

    price: "",

    status: "draft",

    sections: [],

  });



  const updateField = (
    field,
    value
  ) => {

    setCourse((previous) => ({
      ...previous,
      [field]: value,
    }));

  };





  const saveCourse = () => {


    if (!course.title.trim()) {

      alert(
        "Please enter course title."
      );

      return;

    }


    console.log(
      "COURSE DATA:",
      course
    );


    alert(
      "Course saved successfully!"
    );


  };





  return (

    <div className="bg-white rounded-xl shadow p-6">


      <h2 className="text-3xl font-bold mb-8">
        Create Course
      </h2>





      {/* Basic Information */}


      <div className="grid md:grid-cols-2 gap-6">


        <input

          className="border rounded-lg p-3"

          placeholder="Course Title"

          value={course.title}

          onChange={(e)=>
            updateField(
              "title",
              e.target.value
            )
          }

        />



        <input

          className="border rounded-lg p-3"

          placeholder="Course Slug"

          value={course.slug}

          onChange={(e)=>
            updateField(
              "slug",
              e.target.value
            )
          }

        />



        <input

          className="border rounded-lg p-3"

          placeholder="Teacher"

          value={course.teacher}

          onChange={(e)=>
            updateField(
              "teacher",
              e.target.value
            )
          }

        />



        <input

          type="number"

          className="border rounded-lg p-3"

          placeholder="Price"

          value={course.price}

          onChange={(e)=>
            updateField(
              "price",
              e.target.value
            )
          }

        />


      </div>






      <textarea

        className="w-full border rounded-lg p-3 mt-6"

        rows="4"

        placeholder="Short Description"

        value={course.shortDescription}

        onChange={(e)=>
          updateField(
            "shortDescription",
            e.target.value
          )
        }

      />





      <textarea

        className="w-full border rounded-lg p-3 mt-6"

        rows="8"

        placeholder="Long Description"

        value={course.longDescription}

        onChange={(e)=>
          updateField(
            "longDescription",
            e.target.value
          )
        }

      />






      {/* Thumbnail Upload */}


      <ThumbnailUploader

        course={course}

        setCourse={setCourse}

      />







      {/* Video Audio PDF */}


      <CourseMediaManager

        course={course}

        setCourse={setCourse}

      />







      {/* Categories */}


      <CategoryManager

        course={course}

        setCourse={setCourse}

      />







      {/* Modules + Lessons */}


      <SectionManager

        course={course}

        setCourse={setCourse}

      />







      {/* Publish Settings */}


      <PublishSettings

        course={course}

        setCourse={setCourse}

      />








      {/* Save */}


      <button

        type="button"

        onClick={saveCourse}

        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"

      >

        Save Course

      </button>



    </div>

  );

}