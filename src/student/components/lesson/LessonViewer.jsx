import LessonHeader from "./LessonHeader";
import VideoPlayer from "./VideoPlayer";
import LessonContent from "./LessonContent";
import TranscriptPanel from "./TranscriptPanel";
import TranslationPanel from "./TranslationPanel";
import GrammarPanel from "./GrammarPanel";
import VocabularyPanel from "./VocabularyPanel";
import ExercisePanel from "./ExercisePanel";
import ResourcesPanel from "./ResourcesPanel";
import LessonNavigation from "./LessonNavigation";

export default function LessonViewer() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Lesson Header */}

      <LessonHeader />

      {/* Video */}

      <VideoPlayer />

      {/* Lesson Content */}

      <LessonContent />

      {/* Transcript */}

      <TranscriptPanel />

      {/* Translation */}

      <TranslationPanel />

      {/* Grammar */}

      <GrammarPanel />

      {/* Vocabulary */}

      <VocabularyPanel />

      {/* Exercise */}

      <ExercisePanel />

      {/* Resources */}

      <ResourcesPanel />

      {/* Navigation */}

      <LessonNavigation />

    </div>
  );
}