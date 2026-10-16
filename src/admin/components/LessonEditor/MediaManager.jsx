export default function MediaManager({
  lesson,
  setLesson,
}) {


  const updateMedia = (field, value) => {

    setLesson({

      ...lesson,

      media: {

        ...lesson.media,

        [field]: value,

      },

    });

  };



  return (

    <div className="space-y-8">


      <h3 className="text-2xl font-bold">
        Lesson Media
      </h3>




      {/* YouTube Video */}

      <div>

        <label className="block font-semibold mb-2">
          YouTube Video URL
        </label>


        <input

          type="text"

          className="w-full border rounded-lg p-3"

          placeholder="https://youtube.com/watch?v="

          value={
            lesson.media?.youtube || ""
          }

          onChange={(e)=>
            updateMedia(
              "youtube",
              e.target.value
            )
          }

        />

      </div>






      {/* PDF Upload */}

      <div>

        <label className="block font-semibold mb-2">
          PDF File
        </label>


        <input

          type="file"

          accept="application/pdf"

          className="w-full border rounded-lg p-3"


          onChange={(e)=>{

            const file =
              e.target.files[0];


            if(file){

              updateMedia(
                "pdf",
                URL.createObjectURL(file)
              );

            }


          }}

        />



        {
          lesson.media?.pdf && (

            <a

              href={lesson.media.pdf}

              target="_blank"

              className="inline-block mt-3 text-blue-600 underline"

            >

              📄 Open PDF

            </a>

          )
        }


      </div>







      {/* Audio Upload */}

      <div>

        <label className="block font-semibold mb-2">
          Audio File
        </label>



        <input

          type="file"

          accept="audio/*"

          className="w-full border rounded-lg p-3"


          onChange={(e)=>{

            const file =
              e.target.files[0];


            if(file){

              updateMedia(
                "audio",
                URL.createObjectURL(file)
              );

            }


          }}

        />



        {
          lesson.media?.audio && (

            <audio

              controls

              src={lesson.media.audio}

              className="mt-3 w-full"

            />

          )
        }


      </div>








      {/* Subtitle */}

      <div>


        <label className="block font-semibold mb-2">
          Subtitle / Transcript File
        </label>



        <input

          type="file"

          accept=".vtt,.txt"

          className="w-full border rounded-lg p-3"



          onChange={(e)=>{

            const file =
              e.target.files[0];


            if(file){

              updateMedia(
                "subtitle",
                URL.createObjectURL(file)
              );

            }

          }}

        />

      </div>



    </div>

  );

}