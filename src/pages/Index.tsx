import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { useTaskManager } from '@/hooks/useTaskManager';
import { DateNavigation } from '@/components/DateNavigation';
import { CategoryCard } from '@/components/CategoryCard';
import { AddCategory } from '@/components/AddCategory';
import { TopNavigation } from '@/components/TopNavigation';
import { Timer } from '@/components/Timer';
import { MusicPlayer } from '@/components/MusicPlayer';
import { MonthlyPayments } from '@/components/MonthlyPayments';

const Index = () => {
  const [musicAutoPlayTrigger, setMusicAutoPlayTrigger] = useState(0);
  
  const {
    categories,
    tasksForDate,
    selectedDate,
    isLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    addCategoryLink,
    deleteCategoryLink,
    addTask,
    updateTask,
    toggleTask,
    toggleTaskStar,
    reorderTasks,
    deleteTask,
    moveTaskToDate,
    copyTaskToNextDay,
    moveCategoryTasksToNextDay,
    copyCategoryTasksToNextDay,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    moveAllTasksToToday,
    clearAllData,
  } = useTaskManager();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <TopNavigation onClearAllData={clearAllData} />

      {/* Main Content - 2 Column Layout */}
      <main className="container max-w-5xl mx-auto px-4 pb-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left Column - Timer & Music Player */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <Timer onTimerStart={() => setMusicAutoPlayTrigger(prev => prev + 1)} />
            <MusicPlayer autoPlayTrigger={musicAutoPlayTrigger} />
            <MonthlyPayments />
            <MonthlyPayments />
          </div>

          {/* Right Column - Tasks */}
          <div className="space-y-4">
            {/* Date Navigation */}
            <DateNavigation
              selectedDate={selectedDate}
              onPreviousDay={goToPreviousDay}
              onNextDay={goToNextDay}
              onToday={goToToday}
              onMoveAllToToday={moveAllTasksToToday}
            />

            {/* Categories and Tasks */}
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-foreground mb-2">
                  No categories yet
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Create your first category to start organizing your tasks
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  tasks={tasksForDate.filter((t) => t.categoryId === category.id)}
                  onUpdateCategory={updateCategory}
                  onDeleteCategory={deleteCategory}
                  onAddTask={addTask}
                  onToggleTask={toggleTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onMoveTaskToDate={moveTaskToDate}
                  onCopyTaskToNextDay={copyTaskToNextDay}
                  onMoveCategoryTasksToNextDay={moveCategoryTasksToNextDay}
                  onCopyCategoryTasksToNextDay={copyCategoryTasksToNextDay}
                  onToggleTaskStar={toggleTaskStar}
                  onReorderTasks={reorderTasks}
                  onAddCategoryLink={addCategoryLink}
                  onDeleteCategoryLink={deleteCategoryLink}
                />
              ))
            )}

            <AddCategory onAdd={addCategory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;