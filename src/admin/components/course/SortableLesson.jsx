import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableLesson({
  lesson,
  index,
  children,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lesson.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl ${
        isDragging ? "shadow-2xl" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move"
      >
        {children}
      </div>
    </div>
  );
}