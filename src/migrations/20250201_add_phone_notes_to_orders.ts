import { QueryInterface, DataTypes } from 'sequelize';

async function columnExists(queryInterface: QueryInterface, tableName: string, columnName: string): Promise<boolean> {
  try {
    const tableDescription = await queryInterface.describeTable(tableName);
    return columnName in tableDescription;
  } catch (error) {
    console.error(`Error checking column ${columnName} in table ${tableName}:`, error);
    return false;
  }
}

export async function up(queryInterface: QueryInterface): Promise<void> {
  try {
    // Check and add phone column
    const hasPhoneColumn = await columnExists(queryInterface, 'orders', 'phone');
    if (!hasPhoneColumn) {
      await queryInterface.addColumn('orders', 'phone', {
        type: DataTypes.STRING,
        allowNull: true
      });
    }

    // Check and add notes column
    const hasNotesColumn = await columnExists(queryInterface, 'orders', 'notes');
    if (!hasNotesColumn) {
      await queryInterface.addColumn('orders', 'notes', {
        type: DataTypes.TEXT,
        allowNull: true
      });
    }
  } catch (error) {
    console.error('Error in migration:', error);
    throw error;
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  try {
    // Check and remove phone column
    const hasPhoneColumn = await columnExists(queryInterface, 'orders', 'phone');
    if (hasPhoneColumn) {
      await queryInterface.removeColumn('orders', 'phone');
    }

    // Check and remove notes column
    const hasNotesColumn = await columnExists(queryInterface, 'orders', 'notes');
    if (hasNotesColumn) {
      await queryInterface.removeColumn('orders', 'notes');
    }
  } catch (error) {
    console.error('Error in migration rollback:', error);
    throw error;
  }
}
