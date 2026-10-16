import { useLessonBuilderContext } from "../LessonBuilderContext";

export default function useLessonBuilder() {
  const {
    lesson,
    setLesson,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    saveLesson,
  } = useLessonBuilderContext();

  const updateLessonField = (field, value) => {
    setLesson((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const duplicateBlock = (id) => {
    const block = lesson.blocks.find(
      (item) => item.id === id
    );

    if (!block) return;

    const copy = {
      ...block,
      id: Date.now().toString(),
    };

    setLesson((previous) => ({
      ...previous,
      blocks: [...previous.blocks, copy],
    }));
  };

  const clearLesson = () => {
    setLesson({
      title: "",
      slug: "",
      category: "",
      level: "",
      description: "",
      status: "draft",
      blocks: [],
    });
  };

  return {
    lesson,

    updateLessonField,

    addBlock,

    updateBlock,

    deleteBlock,

    duplicateBlock,

    moveBlock,

    saveLesson,

    clearLesson,
  };
}