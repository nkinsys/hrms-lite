# Utility methods for the entire application

def querydict_to_nested_dict(query_dict):
    # Create a nested dictionary structure
    nested_dict = {}

    for key in query_dict.keys():
        # Split the key into parts
        parts = key.replace(']', '').split('[')  # Remove trailing brackets and split

        # Navigate through the nested structure
        current_level = nested_dict
        for i in range(len(parts) - 1):  # All but the last part
            part = parts[i]

            exists = True
            if isinstance(current_level, dict):
                if part not in current_level:
                    exists = False
            elif isinstance(current_level, list):
                part = int(part)
                if len(current_level) <= part:
                    exists = False

            if not exists:
                if isinstance(part, int):
                    current_level.insert(part, [] if parts[i + 1].isdigit() else {})
                else:
                    current_level[part] = [] if parts[i + 1].isdigit() else {}

            current_level = current_level[part]  # Move to the next level

        # Parse values for the final value
        values = query_dict.getlist(key)
        for i in range(len(values)):
            if values[i] == '[]':
                values[i] = []
            elif values[i] == '{}':
                values[i] = {}
        if len(values) == 1:
            values = values[0]

        # The last part is the field where we store the value
        last_part = parts[-1]
        if last_part.isdigit():
            last_part = int(last_part)
            current_level.insert(last_part, values)  # Insert the value
        else:
            current_level[last_part] = values  # Insert the value

    return nested_dict
