import LessonCard from "./LessonCard";


export default function LessonManager({
  section,
  updateSection,
}) {


  const addLesson = () => {


    const newLesson = {

      id: Date.now().toString(),

      title: "New Lesson",

      description: "",

      content: "",

      video: "",

      audio: "",

      pdf: "",

      status: "Draft",

      duration: "",

      preview: false,

    };



    const updatedSection = {

      ...section,

      lessons: [

        ...section.lessons,

        newLesson,

      ],

    };



    updateSection(
      updatedSection
    );

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


      <div className="flex justify-between items-center mb-5">


        <h3 className="text-xl font-bold">

          Lessons

        </h3>




        <button

          onClick={addLesson}

          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"

        >

          + Add Lesson

        </button>


      </div>





      {
        section.lessons.length === 0 ? (

          <p className="text-gray-500">

            No lessons created.

          </p>


        ) : (


          <div className="space-y-4">


            {
              section.lessons.map(
                (lesson,index)=>(


                  <LessonCard

                    key={lesson.id}

                    lesson={lesson}

                    index={index}

                    updateLesson={updateLesson}

                    deleteLesson={deleteLesson}

                  />


                )
              )

            }


          </div>


        )
      }




    </div>

  );

}