---
title: Usage
description: Learn how to use astro-plantuml with various examples and diagram types.
---

# Usage

## Basic Usage

To create a PlantUML diagram in your markdown files, simply use the `plantuml` code fence:

```markdown
```plantuml
@startuml
Alice -> Bob: Hello
Bob --> Alice: Hi there!
@enduml
```

## Examples

### Sequence Diagram

```plantuml
@startuml
actor User
participant "Frontend" as FE
participant "Backend" as BE
database "Database" as DB

User -> FE: Click button
FE -> BE: Send request
BE -> DB: Query data
DB --> BE: Return data
BE --> FE: Send response
FE --> User: Show result
@enduml
```

### Class Diagram

```plantuml
@startuml
class Car {
  -engine: Engine
  -wheels: Wheel[]
  +start(): void
  +stop(): void
  +accelerate(speed: number): void
}

class Engine {
  -cylinders: number
  +start(): void
  +stop(): void
}

class Wheel {
  -size: number
  +rotate(): void
}

Car *-- Engine
Car *-- Wheel
@enduml
```

### Activity Diagram

```plantuml
@startuml
start
:User visits website;
if (Is logged in?) then (yes)
  :Show dashboard;
else (no)
  :Show login form;
endif
:User interacts with site;
stop
@enduml
```

## Tips and Best Practices

1. **Use meaningful names**: Give your diagrams and elements clear, descriptive names
2. **Keep it simple**: Start with basic diagrams and add complexity as needed
3. **Use comments**: Add comments to explain complex parts of your diagrams
4. **Test your diagrams**: Always verify that your diagrams render correctly

## Common Issues

If your diagrams don't render:

1. Make sure you're using the correct code fence syntax (`plantuml`)
2. Check that the PlantUML syntax is valid
3. Verify that the integration is properly configured in your `astro.config.mjs`
4. Ensure you have an internet connection (for the default PlantUML server) 