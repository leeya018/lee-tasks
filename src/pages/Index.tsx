import { CheckSquare } from 'lucide-react';
import { useTaskManager } from '@/hooks/useTaskManager';
import { DateNavigation } from '@/components/DateNavigation';
import { CategoryCard } from '@/components/CategoryCard';
import { AddCategory } from '@/components/AddCategory';
import { SettingsPanel } from '@/components/SettingsPanel';

const Index = () => {
  const {
    categories,
    tasksForDate,
    selectedDate,
    isLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    moveTaskToNextDay,
    copyTaskToNextDay,
    moveCategoryTasksToNextDay,
    copyCategoryTasksToNextDay,
    goToPreviousDay,
    goToNextDay,
    goToToday,
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
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-bold text-foreground">Daily Tasks</h1>
            </div>
            <SettingsPanel onClearAllData={clearAllData} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 pb-8">
        {/* Date Navigation */}
        <DateNavigation
          selectedDate={selectedDate}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onToday={goToToday}
        />

        {/* Categories and Tasks */}
        <div className="space-y-4">
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
                onMoveTaskToNextDay={moveTaskToNextDay}
                onCopyTaskToNextDay={copyTaskToNextDay}
                onMoveCategoryTasksToNextDay={moveCategoryTasksToNextDay}
                onCopyCategoryTasksToNextDay={copyCategoryTasksToNextDay}
              />
            ))
          )}

          <AddCategory onAdd={addCategory} />
        </div>
      </main>
    </div>
  );
};

export default Index;