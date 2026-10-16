import { useState } from "react";

import LessonEditor from "../LessonEditor/LessonEditor";


export default function LessonCard({
  lesson,
  index,
  updateLesson,
  deleteLesson,
}) {

  const [editing, setEditing] = useState(false);



  if (editing) {

    return (

      <LessonEditor

        lesson={lesson}

        updateLesson={updateLesson}

        onClose={() =>
          setEditing(false)
        }

      />

    );

  }





  return (

    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">


      {/* Header */}


      <div className="flex justify-between items-center">


        <div className="flex items-center gap-4">


          {/* Drag Icon */}

          <div
            className="text-2xl text-gray-400 cursor-grab"
          >
            ☰
          </div>



          <div>

            <h4 className="font-bold text-lg">

              Lesson {index + 1}

            </h4>



            <p className="text-gray-700">

              {lesson.title}

            </p>


          </div>


        </div>






        {/* Actions */}


        <div className="flex gap-3">


          <button

            type="button"

            onClick={() =>
              setEditing(true)
            }

            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"

          >

            Edit

          </button>





          <button

            type="button"

            onClick={() =>
              deleteLesson(
                lesson.id
              )
            }

            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"

          >

            Delete

          </button>



        </div>


      </div>







      {/* Information */}



      <div className="grid md:grid-cols-5 gap-4 mt-6 text-sm">



        <div>

          <strong>
            Status
          </strong>

          <br />

          {lesson.status || "Draft"}

        </div>





        <div>

          <strong>
            Text
          </strong>

          <br />

          {lesson.content
            ? "Added"
            : "Empty"}

        </div>





        <div>

          <strong>
            Video
          </strong>

          <br />

          {lesson.video
            ? "Attached"
            : "None"}

        </div>





        <div>

          <strong>
            Audio
          </strong>

          <br />

          {lesson.audio
            ? "Attached"
            : "None"}

        </div>





        <div>

          <strong>
            PDF
          </strong>

          <br />

          {lesson.pdf
            ? "Attached"
            : "None"}

        </div>




      </div>



    </div>

  );

}