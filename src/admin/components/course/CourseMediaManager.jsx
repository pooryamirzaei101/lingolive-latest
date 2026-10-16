export default function CourseMediaManager({
  course,
  setCourse,
}) {


  const updateMedia = (
    field,
    value
  ) => {

    setCourse({

      ...course,

      [field]: value,

    });

  };



  return (

    <div className="mt-10">


      <h3 className="text-2xl font-bold mb-6">
        Course Media
      </h3>



      <div className="grid md:grid-cols-3 gap-6">



        <div>

          <label className="font-semibold">
            Video URL
          </label>

          <input

            className="w-full border rounded-lg p-3 mt-2"

            placeholder="YouTube URL"

            value={course.video || ""}

            onChange={(e)=>
              updateMedia(
                "video",
                e.target.value
              )
            }

          />

        </div>





        <div>

          <label className="font-semibold">
            Audio URL
          </label>


          <input

            className="w-full border rounded-lg p-3 mt-2"

            placeholder="MP3 URL"

            value={course.audio || ""}

            onChange={(e)=>
              updateMedia(
                "audio",
                e.target.value
              )
            }

          />


        </div>





        <div>

          <label className="font-semibold">
            PDF URL
          </label>


          <input

            className="w-full border rounded-lg p-3 mt-2"

            placeholder="PDF URL"

            value={course.pdf || ""}

            onChange={(e)=>
              updateMedia(
                "pdf",
                e.target.value
              )
            }

          />


        </div>



      </div>


    </div>

  );

}