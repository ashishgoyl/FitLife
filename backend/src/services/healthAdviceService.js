/**
 * FitLife Built-in Intelligent Health & Nutrition Analytics Engine
 * Generates personalized daily wellness guidance even if external AI APIs are unreachable.
 */
export function generateBuiltinHealthAdvice(healthData) {
  const { profile = {}, meals = [], exercises = [], waterMl = 0, sleepHours = 0 } = healthData || {}
  const username = profile.username || 'Friend'
  const goal = profile.goal || 'maintain'
  const targetCalories = Number(profile.targetCalories) || 2000
  const targetProtein = Number(profile.targetProtein) || 125
  const targetWater = Number(profile.waterTarget) || 2000
  const targetSleep = Number(profile.sleepTarget) || 8

  const totalCalories = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0)
  const totalProtein = meals.reduce((sum, m) => sum + (Number(m.protein) || 0), 0)
  const totalExerciseMins = exercises.reduce((sum, e) => sum + (Number(e.durationMins) || (e.sets ? e.sets * 1.5 : 0)), 0)

  const calDiff = targetCalories - totalCalories
  const waterDiff = targetWater - waterMl
  const sleepDiff = targetSleep - sleepHours

  if (meals.length === 0 && totalExerciseMins === 0 && waterMl === 0) {
    return (
      `👋 **Hey ${username}! Let's kickstart your healthy day!**\n\n` +
      `• 🥗 **First Meal:** Logging your meals helps monitor your metabolism and keeps your energy steady throughout the day.\n` +
      `• 💧 **Hydration Goal:** Start with a warm glass of water (250–500ml) to awaken digestion.\n` +
      `• 🎯 **Today's Budget:** You have **${targetCalories} kcal** and **${targetProtein}g of protein** ready in your daily targets.\n` +
      `• 👟 **Move a little:** Even a brisk 15-minute walk today will boost circulation and mental focus!\n\n` +
      `*Log your meals and habits above, then click here again for updated, personalized coaching analysis!*`
    )
  }

  let calStatus = ''
  if (calDiff > 300) {
    calStatus = `You have **${calDiff} kcal remaining** today. ${goal === 'lose' ? 'Great calorie deficit pacing for fat loss!' : 'Consider a wholesome snack like nuts, fruit, or boiled eggs to hit your target.'}`
  } else if (calDiff >= -100 && calDiff <= 300) {
    calStatus = `**Spot on!** You are right on track with **${totalCalories} / ${targetCalories} kcal** consumed (${Math.abs(calDiff)} kcal difference). Outstanding portion control!`
  } else {
    calStatus = `You are **${Math.abs(calDiff)} kcal over** your daily target (${totalCalories} / ${targetCalories} kcal). ${goal === 'lose' ? 'No worries! A light evening walk or having high-fiber greens with your next meal will balance it out nicely.' : 'Good caloric surplus for muscle recovery!'}`
  }

  let proteinStatus = ''
  const proteinPercent = Math.round((totalProtein / targetProtein) * 100)
  if (proteinPercent >= 90) {
    proteinStatus = `**Excellent protein intake!** You logged **${totalProtein}g** (${proteinPercent}% of your ${targetProtein}g goal). Your muscles have plenty of amino acids for repair.`
  } else {
    const proteinLeft = targetProtein - totalProtein
    proteinStatus = `You've reached **${totalProtein}g / ${targetProtein}g protein** (${proteinLeft}g remaining). Try adding paneer, dal, Greek yogurt, tofu, or eggs to your next meal.`
  }

  let hydrationStatus = ''
  if (waterMl >= targetWater) {
    hydrationStatus = `**Hydration champion!** You've completed **${waterMl}ml** (Goal: ${targetWater}ml). Hydration promotes optimal digestion and nutrient absorption.`
  } else {
    hydrationStatus = `Hydration is at **${waterMl}ml / ${targetWater}ml** (${waterDiff}ml left). Remember to sip 1–2 more cups of water before the day ends.`
  }

  let exerciseStatus = ''
  if (totalExerciseMins > 0) {
    exerciseStatus = `**Great workout effort!** You logged **${totalExerciseMins} mins** of physical activity across ${exercises.length} exercise(s). Regular physical activity accelerates cardiovascular health and metabolic rate.`
  } else {
    exerciseStatus = `No workouts logged yet today. Aim for at least 20–30 minutes of walking, yoga poses (Surya Namaskar), or stretching to keep your joints agile.`
  }

  let sleepStatus = ''
  if (sleepHours >= 7) {
    sleepStatus = `**Restorative sleep!** You logged **${sleepHours} hours** of rest (Target: ${targetSleep}h). Quality sleep optimizes cortisol and appetite regulation hormones.`
  } else if (sleepHours > 0) {
    sleepStatus = `You logged **${sleepHours} hours** of sleep (Target: ${targetSleep}h). You have a slight sleep deficit of ${sleepDiff > 0 ? sleepDiff : 1}h. Aim for an earlier bedtime tonight to let muscle tissue recharge.`
  } else {
    sleepStatus = `Remember to log your bedtime & wake-up times in the Sleep Tracker to monitor your recovery cycle.`
  }

  return (
    `🌟 **Daily Health Coach Summary for ${username}**\n\n` +
    `• 🔥 **Calorie Balance:** ${calStatus}\n` +
    `• 🥩 **Macronutrients:** ${proteinStatus}\n` +
    `• 💧 **Hydration:** ${hydrationStatus}\n` +
    `• 🏋️ **Active Movement:** ${exerciseStatus}\n` +
    `• 🌙 **Sleep & Recovery:** ${sleepStatus}\n\n` +
    `💡 **Coach's Top Tip for Today:** Prioritize mindful eating, chew slowly, and stay hydrated between meals. You're making consistent progress toward your **${goal === 'lose' ? 'Weight Loss' : goal === 'gain' ? 'Muscle Gain' : 'Healthy Maintenance'}** goal! 🚀`
  )
}

