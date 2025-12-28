/**
 * Base Repository class providing common CRUD operations.
 * Adheres to the Open/Closed Principle (OCP) as it can be extended for specific models.
 */
export class BaseRepository {
    /**
     * @param {Object} model - The Prisma delegate for a specific model (e.g., prisma.product).
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Finds all records matching the given options.
     * @param {Object} [options={}] - Prisma findMany options.
     * @returns {Promise<Array<Object>>} List of records.
     */
    async findAll(options = {}) {
        return this.model.findMany(options);
    }

    /**
     * Finds a single record by its ID.
     * @param {string} id - The UUID of the record.
     * @returns {Promise<Object|null>} The record or null if not found.
     */
    async findById(id) {
        return this.model.findUnique({
            where: { id }
        });
    }

    /**
     * Creates a new record.
     * @param {Object} data - The data for the new record.
     * @returns {Promise<Object>} The created record.
     */
    async create(data) {
        return this.model.create({ data });
    }

    /**
     * Updates an existing record by ID.
     * @param {string} id - The UUID of the record to update.
     * @param {Object} data - The data to update.
     * @returns {Promise<Object>} The updated record.
     */
    async update(id, data) {
        return this.model.update({
            where: { id },
            data
        });
    }

    /**
     * Deletes a record by ID.
     * @param {string} id - The UUID of the record to delete.
     * @returns {Promise<Object>} The deleted record.
     */
    async delete(id) {
        return this.model.delete({
            where: { id }
        });
    }
}
