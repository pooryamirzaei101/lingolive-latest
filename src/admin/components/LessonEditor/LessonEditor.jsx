import { useState } from "react";
import BackButton from "../../../components/BackButton";


export default function LessonEditor({
  lesson,
  updateLesson,
  onClose,
}) {


  const [form, setForm] = useState({

    title: lesson?.title || "",

    description:
      lesson?.description || "",

    content:
      lesson?.content || "",

    video:
      lesson?.video || "",

    audio:
      lesson?.audio || "",

    pdf:
      lesson?.pdf || "",

    status:
      lesson?.status || "Draft",

  });




  const updateField = (
    field,
    value
  ) => {

    setForm({

      ...form,

      [field]: value,

    });

  };





  const saveLesson = () => {


    if (!form.title.trim()) {

      alert(
        "Lesson title is required"
      );

      return;

    }



    updateLesson({

      ...lesson,

      ...form,

    });



    if (onClose) {

      onClose();

    }

  };






  return (

    <div className="bg-white rounded-xl shadow-lg p-8">


      {/* Back */}


      <div className="mb-6">

        <button
          type="button"
          onClick={onClose}
          className="mb-4"
        >

          <BackButton />

        </button>


      </div>






      <h2 className="text-3xl font-bold mb-8">

        Lesson Editor

      </h2>







      {/* Title */}


      <div className="mb-6">

        <label className="block font-semibold mb-2">

          Lesson Title

        </label>


        <input

          type="text"

          value={form.title}

          onChange={(e)=>
            updateField(
              "title",
              e.target.value
            )
          }

          className="w-full border rounded-lg p-3"

          placeholder="Example: Present Simple Grammar"

        />

      </div>








      {/* Description */}


      <div className="mb-6">

        <label className="block font-semibold mb-2">

          Short Description

        </label>


        <textarea

          rows="3"

          value={form.description}

          onChange={(e)=>
            updateField(
              "description",
              e.target.value
            )
          }

          className="w-full border rounded-lg p-3"

        />


      </div>








      {/* Lesson Text */}


      <div className="mb-6">


        <label className="block font-semibold mb-2">

          Lesson Content

        </label>



        <textarea

          rows="8"

          value={form.content}

          onChange={(e)=>
            updateField(
              "content",
              e.target.value
            )
          }

          placeholder="Write lesson text here..."

          className="w-full border rounded-lg p-3"

        />


      </div>








      {/* Media */}


      <div className="grid md:grid-cols-3 gap-6 mb-8">



        <div>


          <label className="block font-semibold mb-2">

            Video URL

          </label>


          <input

            type="text"

            value={form.video}

            onChange={(e)=>
              updateField(
                "video",
                e.target.value
              )
            }

            placeholder="YouTube or video URL"

            className="w-full border rounded-lg p-3"

          />


        </div>






        <div>


          <label className="block font-semibold mb-2">

            Audio URL

          </label>


          <input

            type="text"

            value={form.audio}

            onChange={(e)=>
              updateField(
                "audio",
                e.target.value
              )
            }

            placeholder="MP3 URL"

            className="w-full border rounded-lg p-3"

          />


        </div>







        <div>


          <label className="block font-semibold mb-2">

            PDF URL

          </label>


          <input

            type="text"

            value={form.pdf}

            onChange={(e)=>
              updateField(
                "pdf",
                e.target.value
              )
            }

            placeholder="PDF URL"

            className="w-full border rounded-lg p-3"

          />


        </div>




      </div>








      {/* Status */}


      <div className="mb-8">


        <label className="block font-semibold mb-2">

          Status

        </label>



        <select

          value={form.status}

          onChange={(e)=>
            updateField(
              "status",
              e.target.value
            )
          }

          className="border rounded-lg p-3"

        >

          <option>
            Draft
          </option>


          <option>
            Published
          </option>


        </select>


      </div>








      {/* Buttons */}


      <div className="flex gap-4">


        <button

          type="button"

          onClick={saveLesson}

          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"

        >

          Save Lesson

        </button>





        <button

          type="button"

          onClick={onClose}

          className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg"

        >

          Cancel

        </button>



      </div>




    </div>

  );

}