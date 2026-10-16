import { useState } from "react";
import LessonCard from "../course/LessonCard";


export default function LessonManager({
  section,
  updateSection,
}) {


  const [lessonTitle, setLessonTitle] = useState("");



  const addLesson = () => {


    if (!lessonTitle.trim()) {

      alert("Enter lesson title");

      return;

    }



    const newLesson = {

      id: crypto.randomUUID(),

      title: lessonTitle.trim(),

      description: "",

      content: "",

      video: "",

      audio: "",

      pdf: "",

    };




    updateSection({

      ...section,

      lessons: [

        ...section.lessons,

        newLesson,

      ],

    });



    setLessonTitle("");

  };






  const updateLesson = (
    updatedLesson
  ) => {


    updateSection({

      ...section,


      lessons:
        section.lessons.map(
          (lesson) =>

            lesson.id === updatedLesson.id

              ? updatedLesson

              : lesson

        ),

    });


  };






  const deleteLesson = (
    lessonId
  ) => {


    updateSection({

      ...section,


      lessons:
        section.lessons.filter(
          (lesson) =>
            lesson.id !== lessonId
        ),

    });


  };





  return (

    <div className="mt-6">


      <h3 className="text-xl font-bold mb-4">
        Lessons
      </h3>





      {/* Add Lesson */}


      <div className="flex gap-3 mb-6">


        <input

          type="text"

          value={lessonTitle}

          onChange={(e)=>
            setLessonTitle(
              e.target.value
            )
          }

          placeholder="Lesson title..."

          className="flex-1 border rounded-lg p-3"

        />



        <button

          type="button"

          onClick={addLesson}

          className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg"

        >

          + Add Lesson

        </button>



      </div>






      {/* Lesson List */}


      {section.lessons.length === 0 ? (

        <p className="text-gray-500">
          No lessons yet.
        </p>


      ) : (


        <div className="space-y-4">


          {section.lessons.map(
            (lesson)=>(


            <LessonCard

              key={lesson.id}

              lesson={lesson}

              updateLesson={
                updateLesson
              }

              deleteLesson={
                deleteLesson
              }

            />


          ))}


        </div>


      )}



    </div>

  );

}